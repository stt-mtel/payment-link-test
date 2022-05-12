import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { getTransaction } from "./graphql/queries";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

const Payment = () => {
  const defaultOption = "creditCard";
  const [searchParams] = useSearchParams();
  const [method, setMethod] = useState(defaultOption);
  const [transaction, setTransaction] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  useEffect(() => {
    const retrieveTransaction = async (trxId) => {
      const response = await API.graphql(
        graphqlOperation(getTransaction, { id: trxId })
      );
      if (response.data && response.data.getTransaction) {
        const transaction = response.data.getTransaction;
        if (transaction.status !== "pending") {
          console.error("Transaction is not pending");
          return;
        }
        setTransaction(transaction);
      }
    };

    const id = searchParams.get("id");
    if (id) {
      retrieveTransaction(id);
    }
  }, [searchParams]);

  const handleOnChange = (event) => {
    setMethod(event.target.value);
  };

  const handleOnClick = async () => {
    switch (method) {
      case "creditCard":
        handleOnCreditCardPayment();
        break;
      case "qrCode":
        handleOnQRCodePayment();
        break;
      default:
          
        break;
    }
  };

  const handleOnCreditCardPayment = async () => {
    const response = await API.post(
      "generatePaymentLinkApi",
      "/generate-link",
      {
        body: {
          method: "creditCard",
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          reference: transaction.reference,
          reference2: transaction.reference2,
        },
      }
    );
  };
  
  const handleOnQRCodePayment = async () => {
    const response = await API.post(
      "generatePaymentLinkApi",
      "/generate-link",
      {
        body: {
          method: "qrCode",
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          title: transaction.title,
          description: transaction.description,
        },
      }
      );
      const qrCodeImage = `data:image/png;base64, ${response.qrCodeBase64}`;
      setQrCode(qrCodeImage);
    };
    
    return (
      <Box sx={{ maxWidth: "50%" }}>
      <Card variant="outlined">
        <CardContent>
          <FormControl>
            <Typography variant="h5" component="div">
              Choose Payment Option
            </Typography>
            <RadioGroup defaultValue={defaultOption} onChange={handleOnChange}>
              <FormControlLabel
                value="creditCard"
                control={<Radio />}
                label="Credit Card by Omise"
              />
              <FormControlLabel
                value="qrCode"
                control={<Radio />}
                label="QR by SCB"
              />
            </RadioGroup>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={handleOnClick}>
            Proceed to Payment
          </Button>
        </CardActions>
      </Card>
      <Card>
        <img src={qrCode} style={{width: '50%'}} alt="QR Code" />
      </Card>
    </Box>
  );
};

export default Payment;
