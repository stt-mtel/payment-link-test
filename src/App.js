import { useRef } from "react";
import { API } from "aws-amplify";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const App = () => {
  const refAmount = useRef(null);

  const onClick = async () => {
    console.log("clicked", refAmount.current.value);
    const response = await API.post("generatePaymentLinkApi", "/generate-link", {
      body: {
        method: "creditCard",
        amount: refAmount.current.value,
        currency: "thb",
        title: "Cappuccino",
        description: "Freshly brewed coffee",
      },
    });
    console.log("response", response);
  };

  return (
    <Box sx={{ maxWidth: "50%" }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" component="div">
            Create a payment link
          </Typography>
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
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default App;
