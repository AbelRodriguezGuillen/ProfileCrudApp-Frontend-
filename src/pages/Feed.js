import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link, useNavigate } from "react-router-dom";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";

const Feed = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [profile, setProfile] = useState([]);
  const [reactId, setReactId] = useState();
  const [editId, setEditId] = useState();
  // const { id } = useParams();
  const navigate = useNavigate();

  // GET INITIAL PROFILES & SEARCH
  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/posts/search/${query}`
      );
      setProfile(response.data);
    };
    const fetchInitialProfiles = async () => {
      const response = await axios.get(`http://localhost:8080/api/posts`);
      console.log(response);
      setProfile(response.data);
    };
    if (query.length === 0) fetchInitialProfiles();
    if (query.length > 0) fetchProfiles();
  }, [query]);
  console.log(profile);

  // DELETE BY ID
  useEffect(() => {
    const deleteProfile = async () => {
      const response = await axios.delete(
        `http://localhost:8080/api/posts/${reactId}`
      );
      console.log(response);
    };

    if (reactId !== null && reactId !== undefined) {
      const confirmed = window.confirm(
        "Are you sure you want to delete this profile?"
      );
      if (confirmed) {
        deleteProfile();
        window.location.reload();
      }
    }
  }, [reactId]);
  console.log(reactId);

  // UPDATE
  const handleEditClick = (id) => {
    // Navigate to the edit page with the given ID
    navigate(`/api/posts/edit/${id}`);
  };

  return (
    <Grid container spacing={2} sx={{ margin: "2%" }}>
      <Grid item xs={12} sx={12} md={12} lg={12}>
        <Button sx={{ margin: "1% 2%" }} variant="contained">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Home
          </Link>
        </Button>
        <Box>
          <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            placeholder="Search..."
            sx={{
              width: "25%",
              margin: "0 auto",
              padding: "2%",
            }}
            fullWidth
            onChange={(e) => setQuery(e.target.value)}
          />
          {results.map((result) => (
            <div key={result.id}>{result.title}</div>
          ))}
        </Box>
      </Grid>
      {profile &&
        profile.map((p) => {
          return (
            <Grid key={p.id} item xs={12} md={6} lg={4}>
              <Card sx={{ padding: "3%", overflow: "hidden", width: "84%" }}>
                <Typography
                  variant="h5"
                  sx={{ fontSize: "2rem", fontWeight: "600" }}
                >
                  {p.title}
                </Typography>
                <Typography
                  sx={{ color: "#585858", marginTop: "2%" }}
                  variant="body"
                >
                  Description: {p.desc}
                </Typography>
                <br />
                <br />
                <Typography variant="h6">
                  Years of Experience: {p.yoe} years
                </Typography>

                <Typography gutterBottom variant="body">
                  Skills :{" "}
                </Typography>
                {p.techStack.map((s, i) => {
                  return (
                    <Typography variant="body" gutterBottom key={i}>
                      {i === p.techStack.length - 1 ? s : s + ", "}
                    </Typography>
                  );
                })}
                <Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      sx={{
                        width: "10%",
                        margin: "2% auto",
                        backgroundColor: "red",
                      }}
                      variant="contained"
                      type="submit"
                      value={p.id}
                      onClick={(e) => setReactId(e.target.value)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Typography>
                <Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      sx={{ width: "10%", margin: "2% auto" }}
                      variant="contained"
                      type="submit"
                      value={p.id}
                      onClick={() => handleEditClick(p.id)}
                    >
                      Edit
                    </Button>
                  </Box>
                </Typography>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default Feed;
