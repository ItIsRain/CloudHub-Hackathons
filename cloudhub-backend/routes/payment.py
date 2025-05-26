from fastapi import APIRouter, Request, HTTPException, Depends
from fastapi.responses import JSONResponse
import stripe
from typing import Dict, Any
from pydantic import BaseModel
import json
from models.hackathon import Hackathon
from models.pending_hackathon import PendingHackathon
from datetime import datetime, timedelta
import uuid
import logging
from slugify import slugify

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

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    try:
        package_name = request.package
        logger.info(f"Creating checkout session for package: {package_name}")
        
        if package_name not in PACKAGE_PRICES:
            raise HTTPException(status_code=400, detail="Invalid package selected")
            
        price_in_aed = PACKAGE_PRICES[package_name]
        
        # Calculate expiration time (30 minutes from now)
        current_time = datetime.utcnow()
        expiration_time = current_time + timedelta(minutes=30)
        expires_at = int(expiration_time.timestamp())
        
        logger.info(f"Current time: {current_time.isoformat()}")
        logger.info(f"Expiration time: {expiration_time.isoformat()}")
        logger.info(f"Expires at timestamp: {expires_at}")
        
        # Create Stripe session without expiration
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
            success_url='http://localhost:3000/dashboard/organizer/my-hackathons?payment=success',
            cancel_url='http://localhost:3000/dashboard/organizer/my-hackathons?payment=cancelled'
        )
        
        logger.info(f"Created Stripe session: {session.id}")
        
        # Store pending hackathon data in database
        pending_hackathon = PendingHackathon(
            checkout_id=session.id,
            hackathon_data=request.hackathon_data,
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
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        logger.info(f"Processing completed checkout session: {session.id}")
        
        try:
            # Get the payment intent ID
            payment_intent_id = session.payment_intent
            logger.info(f"Payment intent ID: {payment_intent_id}")
            
            # Get the pending hackathon data from database
            pending_hackathon = await PendingHackathon.find_one(
                PendingHackathon.checkout_id == session.id,
                PendingHackathon.is_processed == False
            )
            
            if not pending_hackathon:
                logger.error(f"No pending hackathon found for checkout ID: {session.id}")
                raise HTTPException(status_code=400, detail="No pending hackathon found for this checkout session")
            
            hackathon_data = pending_hackathon.hackathon_data
            logger.info(f"Retrieved hackathon data for checkout ID: {session.id}")
            
            # Generate a unique slug from the title
            slug = slugify(hackathon_data['title'])
            
            # Format the timeline data
            timeline = {
                "registration_start": datetime.utcnow(),
                "registration_end": hackathon_data.get('registrationDeadline', datetime.utcnow()),
                "event_start": hackathon_data.get('dateRange', {}).get('from', datetime.utcnow()),
                "event_end": hackathon_data.get('dateRange', {}).get('to', datetime.utcnow()),
                "judging_start": hackathon_data.get('dateRange', {}).get('to', datetime.utcnow()),
                "judging_end": hackathon_data.get('dateRange', {}).get('to', datetime.utcnow()),
                "winners_announcement": hackathon_data.get('dateRange', {}).get('to', datetime.utcnow())
            }
            
            # Format the billing data
            billing = {
                "package": hackathon_data.get('package', 'starter'),
                "amount": PACKAGE_PRICES[hackathon_data.get('package', 'starter')],
                "currency": "AED",
                "pricing_tier": hackathon_data.get('package', 'starter').lower(),
                "base_price": PACKAGE_PRICES[hackathon_data.get('package', 'starter')],
                "total_amount": PACKAGE_PRICES[hackathon_data.get('package', 'starter')],
                "is_paid": True,
                "payment_date": datetime.utcnow(),
                "invoice_id": payment_intent_id
            }
            
            # Create complete hackathon data
            complete_hackathon_data = {
                "title": hackathon_data['title'],
                "slug": slug,
                "description": hackathon_data['description'],
                "short_description": hackathon_data['short_description'],
                "cover_image": "https://placehold.co/600x400",
                "banner_image": "https://placehold.co/1200x400",
                "organizer_id": hackathon_data.get('organizer_id', "default"),
                "organization_name": hackathon_data['organization_name'],
                "organization_logo": "https://placehold.co/200x200",
                "max_participants": hackathon_data.get('maxParticipants', 100),
                "min_team_size": hackathon_data.get('min_team_size', 1),
                "max_team_size": hackathon_data.get('max_team_size', 4),
                "is_team_required": hackathon_data.get('is_team_required', True),
                "technologies": [],
                "prizes": hackathon_data.get('prizes', []),
                "total_prize_pool": float(hackathon_data.get('prizePool', 0)),
                "timeline": timeline,
                "requirements": hackathon_data.get('requirements', []),
                "rules": hackathon_data.get('rules', ""),
                "judging_criteria": hackathon_data.get('judgingCriteria', []),
                "challenges": hackathon_data.get('challenges', []),
                "resources": hackathon_data.get('resources', []),
                "submission_template": hackathon_data.get('submission_template'),
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
            
            logger.info(f"Successfully created hackathon after payment. Session ID: {session.id}")
            
        except Exception as e:
            logger.error(f"Error creating hackathon: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to create hackathon: {str(e)}")

    return {"status": "success"} 