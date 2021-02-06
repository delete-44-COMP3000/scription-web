import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import List from "../../list.component";
import Search from "../../search.component";
import NotableDataService from "../../../services/notable.service";
import Edit from "./edit.component";
import Button from "react-bootstrap/Button";

function Show(props) {
  const { notebookId, id } = useParams();

  const [notes, setNotes] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [newRecord, setNewRecord] = useState(false);

  // Filtered notes
  const [queriedNotes, setQueriedNotes] = useState([]);

  const retrieveNotes = useCallback(
    (noteId) => {
      NotableDataService.notes(notebookId, id)
        .then((response) => {
          setNotes(response.data);
          setCurrentId(noteId || null);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    [setNotes, notebookId, id]
  );

  const renderSearch = () => {
    if (notes.length) {
      return (
        <Search
          items={notes}
          queriedItems={queriedNotes}
          setQueriedItems={setQueriedNotes}
          label="content"
        />
      );
    }
  };

  const showNew = () => {
    setNewRecord(true);
    setCurrentId(null);
  };

  // Callback to update the list of chars
  useEffect(() => {
    retrieveNotes();
  }, [retrieveNotes]);

  return (
    <div className="list row">
      <div className="col-md-6">
        <h2 className="capitalise">Notes</h2>

        {renderSearch()}

        <Button onClick={showNew} className="w-100 mb-3">
          Add Note
        </Button>

        <List
          currentId={currentId}
          setCurrentId={setCurrentId}
          items={queriedNotes}
          label="content"
          mentionable
        />
      </div>

      {currentId ? (
        <Edit
          id={currentId}
          notebookId={notebookId}
          retrieveNotes={retrieveNotes}
        />
      ) : (
        <p>No note selected</p>
      )}
    </div>
  );
}

export default Show;