import logo from "./logo.svg";
import "./App.css";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

const GET_USER_REPOS = gql`
  query GetUserRepos($username: String!) {
    user(login: $username) {
      avatarUrl
      name
      repositories(last: 5) {
        nodes {
          id
          name
          description
          url
        }
      }
    }
  }
`;

function App() {
  const [username, setUsername] = useState("");
  const [getUserRepos, { loading, error, data }] = useLazyQuery(GET_USER_REPOS);

  const handleSearch = () => {
    getUserRepos({ variables: { username } });
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Github User Repositories</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Search github username"
      />
      <button onClick={handleSearch}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error : {error.message}</p>}

      {data && data.user && (
        <div>
          <img
            src={data.user.avatarUrl}
            alt={data.user.name}
            width={100}
            style={{ borderRadius: "50%" }}
          />
          <h2>{data.user.name}</h2>
          <h3>Repositories</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {data.user.repositories.nodes.map((repo) => (
              <li key={repo.id} style={{ marginBottom: "10px" }}>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  <strong>{repo.name}</strong>
                </a>
                <p>{repo.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
