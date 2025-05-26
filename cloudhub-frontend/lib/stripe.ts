import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RScUMPPhaYyzZQypOzBmSRZezz40ddXjpL2tzJ7bIzTkP3uWFjGJMhIyEXO0DIOZ5EiswXHIy1A03lzUkttqG1J00IbI60ksH');

export default stripePromise; 