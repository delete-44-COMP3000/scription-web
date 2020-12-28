import "./App.scss";
import { Switch, Route } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Notebooks from "./components/notebooks/index.component";
import Show from "./components/notebooks/show.component";
import Notables from "./components/notables/index.component";

const notableTypes = ["characters", "locations", "items"];

function App() {
  return (
    <div>
      <Navbar bg="primary" variant="light">
        <Navbar.Brand href="/">
          <h1>Scription</h1>
        </Navbar.Brand>
      </Navbar>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/notebooks"]} component={Notebooks} />

          {notableTypes.map((type, index) => (
            <Route
              path={`/notebooks/:notebookId/${type}`}
              children={<Notables type={type} key={type} />}
              key={index}
            />
          ))}

          <Route path="/notebooks/:id" children={<Show />} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
