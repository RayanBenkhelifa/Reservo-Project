const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (req, res) => {
  try {
    const { customerId, providerId, serviceId, selectedDate, startTime, items } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'USD',
          product_data: { name: item.name },
          unit_amount: item.price * 100,  // Convert price to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,  // Redirect here after payment
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        customerId,
        providerId,
        serviceId,
        selectedDate,
        startTime,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
const verifySession = async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    res.json(session);
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(400).json({ error: "Could not verify payment session" });
  }
};
module.exports = { createCheckoutSession,verifySession  };
