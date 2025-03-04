import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { GlobalAddressKeyField, iterateGlobalAddresskeyFields } from './global-address-key';
import { useIsDirty } from './use-is-dirty';

const INPUT_NAME = 'globalAddressKey';
const DEFAULT_VALUE = '';

// https://docs.experianaperture.io/address-validation/experian-address-validation/address-api-reference/api-specification/#/Address%20Validation/post_address_search_v1
const examples = [
  'aWQ9NTYgUXVlZW5zIFJvYWQsIEFTUVVJVEggIE5TVyAyMDc3LCBBdXN0cmFsaWF-YWx0X2tleT0zNzgyMjk0Nn5kYXRhc2V0PUFVU19QQUZ-Zm9ybWF0X2tleT1BVVMkYXUtYWRkcmVzcyQ3LjczMDFPQVVTSEFybUJ3QUFBQUFJQWdFQUFBQUFDZkQ1Z0FBQUFBQUFBRFUyQUFELi4yUUFBQUFBLi4uLi53QUFBQUFBQUFBQUFBQUFBQUFBQURVMklGRjFaV1Z1Y3lCU0FBQUFBQUEtJCQk',
  'aWQ9MTIgSGlnaCBTdHJlZXQsIEFSTUlEQUxFICBOU1cgMjM1MCwgQXVzdHJhbGlhfmFsdF9rZXk9R0FOU1c3MDY2NTA5NTZ-ZGF0YXNldD1BVVNfREFUQUZVU0lPTn5mb3JtYXRfa2V5PUFVUyRkYXRhZnVzaW9uJDcuNzMwNE9BVUVIQUxuQndBQUFBQUlBZ0VBQUFBQUVGVDRVQUFoQUE0QUFBQUFBQUFBQUFELi4xQUFBQUFBLi4uLi53QUFBQUFBQUFBQUFBQUFBQUFBQURFeUlFaHBaMmdnVXlCTlpXeGlBQUFBQUFBLSQkJA',
  'aWQ9TWVsYm91cm5lIENlbnRyYWwsIEtpb3NrIDIsIEdyb3VuZCBGbG9vciAgMzAwIExvbnNkYWxlIFN0cmVldCwgTUVMQk9VUk5FICBWSUMgMzAwMCwgQXVzdHJhbGlhfmFsdF9rZXk9fmRhdGFzZXQ9QVVTX0RBVEFGVVNJT05-Zm9ybWF0X2tleT1BVVMkZGF0YWZ1c2lvbiQ3LjczMFZPQVVFSEFMbkJ3QUFBQUFJQWdFQUFBQUNXeUpBa0JnaEFRSVFDQ0FBQUFBQUFBQUFBUC4uWkFBQUFBRC4uLi4uQUFBQUFBQUFBQUFBQUFBQUFBQUFURzl1YzJSaGJHVWdVM1FnVFdWc1lnQUFBQUFBJCQk',
];

const App: React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const inputId = `input-${id}`;

  const { isDirty, setClean } = useIsDirty(inputRef);
  const [fields, setFields] = useState<GlobalAddressKeyField[] | null>();
  const [error, setError] = useState<Error | null>(null);

  const handleFormSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>((e) => {
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
  }, [])

  return (
    <div className="App container my-5">
      <h1 className="my-3">Decode global address key</h1>
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

      {fields == null ? null : (
        <ol className="my-5">
          {fields.map(([name, value], i) => (
            <li key={`${i}-${name}`} className="my-2">
              <div className="d-flex gap-2 align-items-center">
                <button
                  type="button"
                  className="btn btn-link p-0 font-monospace text-black fw-bold"
                  onClick={() => navigator.clipboard.writeText(value)}
                  title={`Click to copy the value of "${name}" to clipboard`}
                >
                  {name}
                </button>
                <input className="form-control form-control-sm font-monospace" value={value} readOnly />
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default App;
