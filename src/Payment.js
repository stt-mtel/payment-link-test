import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API, graphqlOperation } from "aws-amplify";
import { getTransaction } from "./graphql/queries";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { onUpdateTransaction } from "./graphql/subscriptions";

const Payment = () => {
  const defaultOption = "creditCard";
  const [transactionId, setTransactionId] = useState(null);
  const [searchParams] = useSearchParams();
  const [method, setMethod] = useState(defaultOption);
  const [transaction, setTransaction] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  const [errorContent, setErrorContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const retrieveTransaction = async (trxId) => {
      setTransactionId(trxId);
      const response = await API.graphql(
        graphqlOperation(getTransaction, { id: trxId })
      );
      if (response.data && response.data.getTransaction) {
        const transaction = response.data.getTransaction;
        if (transaction.status !== "pending") {
          setError(true);
          setErrorContent("Transaction is not pending");
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

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateTransaction)
    ).subscribe({
      next: ({ _, value }) => {
        const { id, status } = value.data.onUpdateTransaction;
        if (id === transactionId && status === "paid") {
          setSuccess(true);
        }
      },
      error: (error) => {
        setError(true);
        setErrorContent("Something went wrong");
      },
    });
    return () => subscription.unsubscribe();
  }, [transactionId]);

  const handleOnChange = (event) => {
    setMethod(event.target.value);
  };

  const handleOnClick = async () => {
    setLoading(true);
    switch (method) {
      case "creditCard":
        handleOnCreditCardPayment();
        break;
      case "qrCode":
        handleOnQRCodePayment();
        break;
      default:
        setError(true);
        setErrorContent("Invalid method");
        return;
    }
  };

  const handleOnCreditCardPayment = async () => {
    try {
      const response = await API.post(
        "generatePaymentLinkApi",
        "/generate-link",
        {
          body: {
            method: "creditCard",
            id: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            title: transaction.title,
            description: transaction.description,
          },
        }
      );
      openInNewTab(response.paymentUri);
    } catch (e) {
      setError(true);
      setErrorContent(
        "Error generating a payment link - Please contact an administrator"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOnQRCodePayment = async () => {
    try {
      const response = await API.post(
        "generatePaymentLinkApi",
        "/generate-link",
        {
          body: {
            method: "qrCode",
            id: transaction.id,
            amount: transaction.amount,
            currency: transaction.currency,
            reference: transaction.reference,
            reference2: transaction.reference2,
          },
        }
      );
      const qrCodeImage = `data:image/png;base64, ${response.qrCodeBase64}`;
      setQrCode(qrCodeImage);
    } catch (e) {
      setError(true);
      setErrorContent(
        "Error generating a QR code - Please contact an administrator"
      );
    } finally {
      setLoading(false);
    }
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Grid container>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <Grid
          container
          rowSpacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          {!success && (
            <Card variant="outlined">
              <CardContent>
                {error && <Alert severity="error">{errorContent}</Alert>}
                <FormControl>
                  <Typography variant="h5" component="div">
                    Choose Payment Option
                  </Typography>
                  <RadioGroup
                    defaultValue={defaultOption}
                    onChange={handleOnChange}
                  >
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
                {loading && <CircularProgress />}
                {!loading && (
                  <Button
                    variant="outlined"
                    disabled={error}
                    onClick={handleOnClick}
                  >
                    Proceed to Payment
                  </Button>
                )}
              </CardActions>
            </Card>
          )}
          {success && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h4" component="div">
                  Payment is successful
                </Typography>
              </CardContent>
            </Card>
          )}
          <Card>
            {qrCode && (
              <center><img src={qrCode} style={{ width: "50%" }} alt="QR Code" /></center>
            )}
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
};

export default Payment;
