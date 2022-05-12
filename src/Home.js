import { useRef, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { createTransaction } from "./graphql/mutations";
import Hashids from "hashids";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Home = () => {
  const refTitle = useRef(null);
  const refAmount = useRef(null);
  const refDescription = useRef(null);
  const [link, setLink] = useState(null);

  const onClick = async () => {
    const hashids = new Hashids();
    const response = await API.graphql(
      graphqlOperation(createTransaction, {
        input: {
          title: refTitle.current.value,
          description: refDescription.current.value,
          amount: parseInt(refAmount.current.value),
          currency: "thb",
          status: "pending",
          reference: hashids.encode(Date.now(), 10).toUpperCase(),
          reference2: hashids.encode(refAmount.current.value, 10).toUpperCase(),
        },
      })
    );

    if (response.data && response.data.createTransaction) {
        setLink(window.location.href + 'payment?id=' + response.data.createTransaction.id);
    }
  };

  return (
    <Box sx={{ maxWidth: "50%" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            Create a payment link
          </Typography>
          <TextField
            id="title"
            label="Title"
            variant="outlined"
            inputRef={refTitle}
          />
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            inputRef={refDescription}
          />
          <TextField
            id="amount"
            label="Amount"
            variant="outlined"
            inputRef={refAmount}
          />
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={onClick}>
            Create
          </Button> {link}
        </CardActions>
      </Card>
    </Box>
  );
};

export default Home;
