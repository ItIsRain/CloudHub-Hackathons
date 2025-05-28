from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
import stripe
from typing import Dict, Any
from pydantic import BaseModel
import json
from models.hackathon import Hackathon
from models.pending_hackathon import PendingHackathon
from models.user import User
from datetime import datetime, timedelta
import uuid
import logging
from slugify import slugify
from dateutil import parser
from auth.jwt_manager import get_current_user

router = APIRouter()
logger = logging.getLogger(__name__)

# Initialize Stripe with the secret key
stripe.api_key = "sk_test_51RScUMPPhaYyzZQyRrYhUpj6irI1h2RdHVuUNzebLq5aRUzAn5KVbSKM7a1EErnnIYuy3SKocxYKui4DnvQlm4V800s0tOde7P"

# Get this from your Stripe Dashboard after setting up the webhook
STRIPE_WEBHOOK_SECRET = "whsec_kgtYyDwjVBDCtwUx6rdoee1feTzFjNWr"

PACKAGE_PRICES = {
    "Starter": 2500,  # AED 2,500
    "Growth": 7500,   # AED 7,500
    "Scale": 20000    # AED 20,000
}

class CheckoutSessionRequest(BaseModel):
    package: str
    hackathon_data: Dict[str, Any]

def parse_date(date_input):
    """Helper function to parse date from various formats"""
    if isinstance(date_input, str):
        try:
            return parser.parse(date_input)
        except:
            return datetime.utcnow()
    elif isinstance(date_input, datetime):
        return date_input
    else:
        return datetime.utcnow()

@router.post("/create-checkout-session")
async def create_checkout_session(
    request: CheckoutSessionRequest, 
    current_user: User = Depends(get_current_user)  # Fixed: User instead of dict
):
    try:
        package_name = request.package
        logger.info(f"Creating checkout session for package: {package_name} by user: {current_user.email}")
        
        if package_name not in PACKAGE_PRICES:
            raise HTTPException(status_code=400, detail="Invalid package selected")
            
        price_in_aed = PACKAGE_PRICES[package_name]
        
        # Calculate expiration time (30 minutes from now)
        current_time = datetime.utcnow()
        expiration_time = current_time + timedelta(minutes=30)
        
        logger.info(f"Current time: {current_time.isoformat()}")
        logger.info(f"Expiration time: {expiration_time.isoformat()}")
        
        # Add organizer_id to hackathon_data
        hackathon_data = request.hackathon_data.copy()
        hackathon_data['organizer_id'] = str(current_user.id)  # Convert ObjectId to string
        hackathon_data['organizer_email'] = current_user.email
        
        # Create Stripe session WITH session_id in success URL
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'aed',
                    'product_data': {
                        'name': f'CloudHub Hackathon {package_name} Package',
                        'description': f'Access to organize hackathons with the {package_name} package features',
                    },
                    'unit_amount': price_in_aed * 100,  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:3000/dashboard/organizer/my-hackathons?payment=success&session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:3000/dashboard/organizer/my-hackathons?payment=cancelled&session_id={CHECKOUT_SESSION_ID}',
            customer_email=current_user.email,  # Add customer email
            metadata={
                'user_id': str(current_user.id),
                'package': package_name,
                'hackathon_title': hackathon_data.get('title', 'Unknown')
            }
        )
        
        logger.info(f"Created Stripe session: {session.id}")
        
        # Store pending hackathon data in database
        pending_hackathon = PendingHackathon(
            checkout_id=session.id,
            hackathon_data=hackathon_data,
            expires_at=expiration_time
        )
        await pending_hackathon.create()
        logger.info(f"Stored pending hackathon data with checkout ID: {session.id}")
        
        return {
            'sessionId': session.id,
            'url': session.url
        }
        
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@router.get("/verify-session/{session_id}")
async def verify_payment_session(
    session_id: str, 
    current_user: User = Depends(get_current_user)  # Fixed: User instead of dict
):
    try:
        logger.info(f"Verifying payment session: {session_id} for user: {current_user.email}")
        
        # Retrieve the session from Stripe
        session = stripe.checkout.Session.retrieve(session_id)
        logger.info(f"Stripe session status: {session.payment_status}")
        
        if session.payment_status == 'paid':
            # Check if hackathon was already created
            pending_hackathon = await PendingHackathon.find_one(
                PendingHackathon.checkout_id == session_id
            )
            
            if pending_hackathon and not pending_hackathon.is_processed:
                logger.info(f"Processing hackathon creation for session: {session_id}")
                
                # Process the hackathon creation
                await process_hackathon_creation(session, pending_hackathon)
                
            return {
                "success": True,
                "payment_status": session.payment_status,
                "session_id": session_id
            }
        else:
            return {
                "success": False,
                "payment_status": session.payment_status,
                "session_id": session_id,
                "message": "Payment not completed"
            }
            
    except Exception as e:
        logger.error(f"Error verifying payment session: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

async def process_hackathon_creation(session, pending_hackathon):
    """Process hackathon creation after successful payment"""
    try:
        hackathon_data = pending_hackathon.hackathon_data
        logger.info(f"Processing hackathon creation for: {hackathon_data.get('title', 'Unknown')}")
        
        # Generate a unique slug from the title
        base_slug = slugify(hackathon_data['title'])
        slug = base_slug
        counter = 1
        
        # Ensure slug is unique
        while await Hackathon.find_one(Hackathon.slug == slug):
            slug = f"{base_slug}-{counter}"
            counter += 1
        
        # Parse dates properly
        date_range = hackathon_data.get('dateRange', {})
        registration_deadline = parse_date(hackathon_data.get('registrationDeadline'))
        event_start = parse_date(date_range.get('from'))
        event_end = parse_date(date_range.get('to'))
        
        # Format the timeline data
        timeline = {
            "registration_start": datetime.utcnow(),
            "registration_end": registration_deadline,
            "event_start": event_start,
            "event_end": event_end,
            "judging_start": event_end,
            "judging_end": event_end + timedelta(days=1),
            "winners_announcement": event_end + timedelta(days=2)
        }
        
        # Get payment intent for invoice ID
        payment_intent_id = session.get('payment_intent') or session.get('id')
        
        # Format the billing data
        package_name = hackathon_data.get('package', 'Starter')
        billing = {
            "package": package_name,
            "amount": PACKAGE_PRICES.get(package_name, 2500),
            "currency": "AED",
            "pricing_tier": package_name.lower(),
            "base_price": PACKAGE_PRICES.get(package_name, 2500),
            "total_amount": PACKAGE_PRICES.get(package_name, 2500),
            "is_paid": True,
            "payment_date": datetime.utcnow(),
            "invoice_id": payment_intent_id,
            "stripe_session_id": session.get('id')
        }
        
        # Helper function to get valid URL or default
        def get_valid_url(url_value, default_url):
            return url_value if url_value and url_value.strip() else default_url
        
        # Create complete hackathon data with proper URL handling
        complete_hackathon_data = {
            "title": hackathon_data['title'],
            "slug": slug,
            "description": hackathon_data['description'],
            "short_description": hackathon_data.get('short_description', hackathon_data['description'][:200]),
            # Fix: Handle empty URL strings by providing defaults
            "cover_image": get_valid_url(
                hackathon_data.get('cover_image'), 
                "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=600&h=400&fit=crop"
            ),
            "banner_image": get_valid_url(
                hackathon_data.get('banner_image'), 
                "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200&h=400&fit=crop"
            ),
            "organizer_id": hackathon_data.get('organizer_id'),
            "organization_name": hackathon_data.get('organization_name', 'Anonymous Organization'),
            "organization_logo": get_valid_url(
                hackathon_data.get('organization_logo'), 
                "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&h=200&fit=crop"
            ),
            "max_participants": hackathon_data.get('maxParticipants', 100),
            "min_team_size": hackathon_data.get('min_team_size', 1),
            "max_team_size": hackathon_data.get('max_team_size', 4),
            "is_team_required": hackathon_data.get('is_team_required', True),
            "technologies": hackathon_data.get('technologies', []),
            "prizes": hackathon_data.get('prizes', []),
            "total_prize_pool": float(hackathon_data.get('prizePool', 0)),
            "timeline": timeline,
            "requirements": hackathon_data.get('requirements', []),
            "rules": hackathon_data.get('rules', ""),
            "judging_criteria": hackathon_data.get('judgingCriteria', []),
            "challenges": hackathon_data.get('challenges', []),
            "resources": hackathon_data.get('resources', []),
            "submission_template": hackathon_data.get('submission_template', ""),
            "billing": billing,
            "tags": hackathon_data.get('tags', []),
            "is_featured": False,
            "is_private": hackathon_data.get('isPrivate', False),
            "status": "draft"
        }
        
        # Create hackathon in database
        hackathon = Hackathon(**complete_hackathon_data)
        await hackathon.create()
        
        # Mark pending hackathon as processed
        pending_hackathon.is_processed = True
        pending_hackathon.processed_at = datetime.utcnow()
        await pending_hackathon.save()
        
        logger.info(f"Successfully created hackathon: {hackathon.title} (ID: {hackathon.id})")
        
    except Exception as e:
        logger.error(f"Error creating hackathon: {str(e)}")
        raise e
    
@router.post("/webhook")
async def webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    
    logger.info("Received webhook from Stripe")
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
        logger.info(f"Webhook event type: {event['type']}")
    except ValueError as e:
        logger.error(f"Invalid payload: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid signature: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        session_id = session['id']
        logger.info(f"Processing completed checkout session: {session_id}")
        
        try:
            # Get the pending hackathon data from database
            pending_hackathon = await PendingHackathon.find_one(
                PendingHackathon.checkout_id == session_id,
                PendingHackathon.is_processed == False
            )
            
            if not pending_hackathon:
                logger.error(f"No pending hackathon found for checkout ID: {session_id}")
                return {"status": "error", "message": "No pending hackathon found"}
            
            # Process hackathon creation
            await process_hackathon_creation(session, pending_hackathon)
            
            logger.info(f"Successfully processed webhook for session: {session_id}")
            
        except Exception as e:
            logger.error(f"Error processing webhook: {str(e)}")
            # Don't raise here to avoid webhook retries
            return {"status": "error", "message": str(e)}

    return {"status": "success"}