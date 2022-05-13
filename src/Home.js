import { useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTransaction } from "./graphql/mutations";
import Hashids from "hashids";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from '@mui/material/Alert';
import Grid from "@mui/material/Grid";

const Home = () => {
  const refTitle = useRef(null);
  const refAmount = useRef(null);
  const refDescription = useRef(null);
  const [link, setLink] = useState(null);
  const [error, setError] = useState(null);
  const [errorContent, setErrorContent] = useState(null);

  const onClick = async () => {
    const title = refTitle.current.value;
    const description = refDescription.current.value;
    const amount = parseFloat(refAmount.current.value);
    setError(false);

    if(!title){
      setError(true);
      setErrorContent("Title is required");
      return;
    }

    if(!description){
      setError(true);
      setErrorContent("Description is required");
      return;
    }
    
    if(isNaN(amount) || amount < 20 || amount > 20000){
      setError(true);
      setErrorContent("Amount is required and must be between 20 and 20000");
      return;
    }

    const hashids = new Hashids();
    const response = await API.graphql(
      graphqlOperation(createTransaction, {
        input: {
          title: title,
          description: description,
          amount: amount.toFixed(2),
          currency: "thb",
          status: "pending",
          reference: hashids.encode(Date.now(), 10).toUpperCase(),
          reference2: "DM",
        },
      })
    );

    if (response.data && response.data.createTransaction) {
      setLink(
        window.location.href +
          "payment?id=" +
          response.data.createTransaction.id
      );
    }
  };

  return (
    <Grid container>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <Card variant="outlined">
          {error && <Alert severity='error'>{errorContent}</Alert>}
          <CardContent>
            <Grid
              container
              rowSpacing={2}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Typography variant="h6" component="div">
                  Create a payment link
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="title"
                  label="Title"
                  variant="outlined"
                  inputProps={{ maxLength: 12 }}
                  inputRef={refTitle}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  inputProps={{ maxLength: 20 }}
                  inputRef={refDescription}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="amount"
                  label="Amount"
                  variant="outlined"
                  type={"number"}
                  InputProps={{ maxLength: 10 }}
                  inputRef={refAmount}
                  fullWidth={true}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" onClick={onClick}>
                  Create
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions> {link}</CardActions>
        </Card>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
};

export default Home;
