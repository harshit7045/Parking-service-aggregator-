import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, Navigate } from "react-router-dom";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Cookies from "js-cookie";

const stripePromise = loadStripe(
  "pk_test_51PosA3H35XY8u0JzOYqafQzcmDFPIRl2cWXDIyAjyy8GnIuHSrpSVnHbhwgXWKfPqcRcgkWVosp4PxtYXDiYS5Lp00ZUWcBz4P"
);

const CheckoutForm = () => {
  const location = useLocation();
  const { amount } = location.state || { amount: 0 }; // Default to 0 if no amount is passed

  const fetchClientSecret = useCallback(() => {
    return fetch(`http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/payment/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // Send the amount to the backend
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Client Secret:", data.clientSecret); // Debugging line
        return data.clientSecret;
      });
  }, [amount]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout" style={{ width: "100vw" }}>
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState("");
  const [hasAddedBalance, setHasAddedBalance] = useState(false); // State to track if balance has been added

  useEffect(() => {
    const fetchSessionStatus = async () => {
      console.log("Fetching session status..."); // Debugging line
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get("session_id");

      try {
        const response = await fetch(
          `http://${process.env.REACT_APP_BACKEND_IP}:${process.env.REACT_APP_BACKEND_PORT}/api/payment/session-status?session_id=${sessionId}`
        );
        const data = await response.json();

        console.log("Session data:", data); // Debugging line

        setStatus(data.status);
        setCustomerEmail(data.customer_email);

        if (data.status === "paid" && !hasAddedBalance) {
          // Ensure that data.amount is correctly passed
          if (data.amount !== undefined && data.amount !== null) {
            console.log("Calling addWalletBalance"); // Debugging line
            await addWalletBalance(data.amount); // Call the function to add the balance
            setHasAddedBalance(true); // Prevent multiple calls
          } else {
            console.error(
              "Amount is undefined or null in the session status response."
            );
          }
        }
      } catch (error) {
        console.error("Error fetching session status:", error);
      }
    };

    fetchSessionStatus();
  }, [hasAddedBalance]); // Add hasAddedBalance to dependency array

  if (status === "open") {
    return <Navigate to="/checkout" />;
  }

  if (status === "paid") {
    return (
      <section
        id="success"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          flexDirection: "column",
          width: "400px",
          height: "112px",
          borderRadius: "6px",
          height: "50vh",
          width: "100%",
        }}
      >
        <p
          style={{
            fontStyle: "normal",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "20px",
            letterSpacing: "-0.154px",
            color: "#242d60",
            height: "100%",
            width: "100%",
            padding: "0 20px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          We appreciate your business! A confirmation email will be sent to{" "}
          {customerEmail}. If you have any questions, please email{" "}
          <a href="mailto:harshit7099@gmail.com">orders@example.com</a>.
        </p>
      </section>
    );
  }

  return null;
};

async function addWalletBalance(amount) {
  try {
    // Check if amount is valid
    if (amount === undefined || amount === null) {
      throw new Error("Amount is undefined or null.");
    }

    console.log("Amount to be added to wallet:", amount); // Debugging line

    const response = await fetch(
      "http://" + process.env.REACT_APP_BACKEND_IP + ":" + process.env.REACT_APP_BACKEND_PORT + "/api/users/addwalletbalance",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: Cookies.get("token"),
        },
        body: JSON.stringify({
          amount: amount.toString(), // Ensure amount is a valid string
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response from addWalletBalance:", data);
  } catch (error) {
    console.error("Error in addWalletBalance:", error);
  }
}

export { CheckoutForm, Return };
