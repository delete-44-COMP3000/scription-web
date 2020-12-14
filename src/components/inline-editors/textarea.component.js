import React, { useState, useCallback, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import useKeypress from "../../hooks/useKeypress";
import NotebookDataService from "../../services/notebook.service";
import "../../scss/inline-editor.scss";

function TextArea(props) {
  // Define callbacks for GETting and SETting the rest & busy states of the component
  const [atRest, setAtRest] = useState(true);
  const [isBusy, setIsBusy] = useState(false);

  // Define callbacks for GETting and SETting the input value & error message
  const [value, setValue] = useState(props.value);
  const [error, setError] = useState("");

  const inputRef = useRef(null);
  const spanRef = useRef(null);

  // Function to submit data & return to rest state
  const saveAndExit = useCallback(() => {
    const { id, model, param } = props;
    setAtRest(true);
    setIsBusy(true);

    NotebookDataService.update(id, model, param, value)
      .then(() => {
        setIsBusy(false);
        setError("");
      })
      .catch((e) => {
        setIsBusy(false);
        setError(e.response.data.join(", "));
      });
  }, [value, props, setIsBusy, setError]);

  const exitWithoutSaving = useCallback(() => {
    setAtRest(true);
    setValue(props.value);
  }, [props.value, setAtRest, setValue]);

  // Callback(/event handler) for when text is changed
  const onChange = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  // Callback for escape key - exit without saving (*only if the textbox is focused)
  useKeypress(
    "Escape",
    () => {
      if (document.activeElement === inputRef.current) {
        exitWithoutSaving();
      }
    },
    [atRest, setAtRest, setValue]
  );

  // Callback for enter key - save & exit (*only if the textbox is focused)
  useKeypress(
    "Enter",
    () => {
      if (atRest) {
        if (document.activeElement === spanRef.current) {
          // If component is at rest and span has focus, enter should simulate clicking the span
          onSpanClick();
        }
      } else {
        if (document.activeElement === inputRef.current) {
          // If component is not at rest and text field has focus, enter should save and exit
          saveAndExit();
        }
      }
    },
    [atRest, setAtRest, value]
  );

  // Set focus to the text field when shown
  useEffect(() => {
    if (!atRest) {
      inputRef.current.focus();
      inputRef.current.value = value || props.value;
    }
  }, [atRest, value, props]);

  // Update value when the given prop changes
  useEffect(() => {
    setValue(props.value);
    setError("");
  }, [props.value, setError]);

  // Callback to update the rest state when the text span is clicked
  const onSpanClick = useCallback(() => setAtRest(false), [setAtRest]);

  return (
    <span>
      <div className="d-inline-flex justify-content-start align-items-center w-100">
        <section
          className={`inline-label ${
            props.value || value ? "" : "placeholder"
          }`}
          onClick={onSpanClick}
          hidden={!atRest}
          role="switch"
          aria-checked={!atRest}
          tabIndex="0"
          ref={spanRef}
        >
          <span
            role="complementary"
            className="inline-textarea-label"
            style={{ fontSize: props.fontSize || "1rem" }}
          >
            {value || props.value || `No ${props.param} saved.`}
          </span>
        </section>

        <Form.Control
          as="textarea"
          rows={3}
          style={{ fontSize: props.fontSize || "1rem" }}
          ref={inputRef}
          type={"text"}
          value={value || ""}
          onChange={onChange}
          className="inline-input"
          hidden={atRest}
          disabled={isBusy}
        />

        <Spinner
          animation="border"
          role="status"
          className="ml-3"
          title="Saving changes"
          hidden={!isBusy}
          size="sm"
        />
      </div>

      <p className="help-text" hidden={atRest}>
        Press{" "}
        <Button variant="link" onClick={saveAndExit}>
          enter
        </Button>{" "}
        to save &middot; Press{" "}
        <Button variant="link" onClick={exitWithoutSaving}>
          escape
        </Button>{" "}
        to cancel &middot; Use shift+enter to add a new line
      </p>
      <p className="error">{error}</p>
    </span>
  );
}

export default TextArea;
