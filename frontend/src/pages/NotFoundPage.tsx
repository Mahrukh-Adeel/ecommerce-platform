import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "6rem", md: "12rem" },
            fontWeight: "bold",
            color: "primary.main",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            lineHeight: 0.8,
          }}
        >
          404
        </Typography>
      </Box>

      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          color: "text.primary",
          fontWeight: 600,
          mb: 2,
        }}
      >
        Oops! This Room Seems Empty
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        sx={{
          maxWidth: 600,
          mx: "auto",
          mb: 4,
          lineHeight: 1.6,
        }}
      >
        Looks like the page you're looking for has been moved, deleted, or
        doesn't exist. But don't worry - our furniture collection is still fully
        stocked!
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            px: 4,
            py: 1.5,
            mr: 2,
            "&:hover": {
              bgcolor: "primary.dark",
              transform: "translateY(-2px)",
              boxShadow: 4,
            },
            transition: "all 0.3s ease",
          }}
        >
          Go Back
        </Button>

        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/")}
          sx={{
            borderColor: "secondary.main",
            color: "secondary.main",
            px: 4,
            py: 1.5,
            "&:hover": {
              bgcolor: "secondary.main",
              color: "white",
              transform: "translateY(-2px)",
              boxShadow: 4,
            },
            transition: "all 0.3s ease",
          }}
        >
          Home Page
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;