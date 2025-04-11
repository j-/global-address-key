import React, { type FC, type FormEventHandler, useCallback, useEffect, useId, useRef, useState } from 'react';
import { FieldsTable } from './FieldsTable';
import { GlobalAddressKeyField, iterateGlobalAddresskeyFields } from './global-address-key';
import { useIsDirty } from './use-is-dirty';
import { examples } from './examples';

const INPUT_NAME = 'globalAddressKey';
const DEFAULT_VALUE = '';

const App: FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const inputId = `input-${id}`;

  const { isDirty, setClean } = useIsDirty(inputRef);
  const [fields, setFields] = useState<GlobalAddressKeyField[] | null>();
  const [error, setError] = useState<Error | null>(null);

  const handleFormSubmit = useCallback<FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const globalAddressKey = data.get(INPUT_NAME);
    if (typeof globalAddressKey !== 'string') return;
    try {
      setError(null);
      const fields = Array.from(iterateGlobalAddresskeyFields(globalAddressKey));
      setFields(fields);
    } catch (err) {
      setError(err as Error);
    } finally {
      setClean(globalAddressKey);
    }
  }, []);

  const handleFormReset = useCallback(() => {
    setFields(null);
    setError(null);
    setClean(null);
  }, []);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const form = input.form;
    if (!form) return;
    const pasteHandler = () => {
      input.select();
      setTimeout(() => {
        form.requestSubmit();
        input.select();
      }, 0);
    };
    window.addEventListener('paste', pasteHandler, { capture: true });
    return () => window.removeEventListener('paste', pasteHandler);
  }, []);

  return (
    <div className="App container my-5">
      <a href="https://skeoh.com/" className="text-secondary">&larr; skeoh.com</a>
      <h1 className="mb-5">Decode global address key</h1>

      <p className="my-3">Get fields from Experian QAS global address key.</p>

      <form className="my-5" onSubmit={handleFormSubmit} onReset={handleFormReset}>
        <div className="form-group my-3">
          <label htmlFor={inputId} className="form-label fw-bold">Global address key</label>
          <textarea
            className="form-control font-monospace"
            style={{ wordBreak: 'break-all' }}
            ref={inputRef}
            id={inputId}
            name={INPUT_NAME}
            defaultValue={DEFAULT_VALUE}
            rows={6}
          />
        </div>

        <div className="d-flex gap-4 justify-content-between my-3">
          <div>
            <button className={`btn ${isDirty ? 'btn-primary' : 'btn-light'}`} type="submit">Decode</button>
          </div>
          <div>
            {examples.map((example, i) => (
              <button
                key={`example-${i}`}
                className="btn btn-link"
                type="button"
                onClick={(e) => {
                  if (!inputRef.current || !e.currentTarget.form) return;
                  if (inputRef.current.value === example) {
                    inputRef.current.focus();
                    return;
                  }
                  // Does not push to undo stack.
                  // inputRef.current.value = example;

                  // Also does not push to undo stack.
                  // inputRef.current.setRangeText(example, 0, inputRef.current.value.length, 'select');

                  // Pushes to undo stack but `execCommand()` is deprecated.
                  inputRef.current.select();
                  document.execCommand('insertText', false, example);

                  e.currentTarget.form.requestSubmit();
                }}
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <div>
            <button className="btn btn-light" type="reset">Clear</button>
          </div>
        </div>
      </form>

      {error == null ? null : (
        <p>{error.message}</p>
      )}

      {fields == null ? null : <FieldsTable fields={fields} />}
    </div>
  );
};

export default App;
