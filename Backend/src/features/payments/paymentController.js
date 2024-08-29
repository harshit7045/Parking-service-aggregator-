import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51PosA3H35XY8u0JzapupiEC7LHJRgpnoR5nQGAc6OznpLmstr2bqk5ezYsKU0zHx3lmOqDGU68lGgcPL6XonPnsi00vw3Rveja');
const YOUR_DOMAIN = 'http://localhost:3000';

const paymentController = {
  createCheckOutSession: async (req, res) => {
    try{
      console.log(req.body.amount);
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: parseInt(req.body.amount) * 100,
            product_data: {
              name: "Adding Money",
              description: "Adding Money",
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.send({ clientSecret: session.client_secret });
    } catch (error) { 
      console.error("Error creating checkout session:", error);
      res.status(500).send({ error: "Failed to create checkout session" });
    }
  },

  sessionStatus: async (req, res) => {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

      res.send({
        status: session.payment_status, // Changed to payment_status to correctly reflect the session payment status
        customer_email: session.customer_details.email,
        amount: session.amount_total, // This will return the total amount in cents
      });
    } catch (error) {
      console.error("Error retrieving session status:", error);
      res.status(500).send({ error: "Failed to retrieve session status" });
    }
  },
};

export default paymentController;
