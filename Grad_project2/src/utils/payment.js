import Stripe from "stripe";

function payment({
    stripe=new Stripe(process.env.SECRETE_KEY),
    payment_method_types=["card"],
    mode="payment",
    success_url=process.env.SUCCESS_URL,
    cancel_url=process.env.CANCEL_URL,
    discounts=[],
    metadata={},
    customer_email,
    line_items=[]
}= {} ){
    
    const session=stripe.checkout.sessions.create({
        payment_method_types,
        mode,
        success_url,
        cancel_url,
        discounts,
        customer_email,
        metadata,
        line_items,
        customer_email
    })
    return session
}

export default payment