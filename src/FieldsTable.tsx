import React, { type FC } from 'react';
import type { GlobalAddressKeyField } from './global-address-key';
import './FieldsTable.css';

export type FieldsTableProps = {
  fields: GlobalAddressKeyField[];
};

export const FieldsTable: FC<FieldsTableProps> = ({ fields }) => {
  return (
    <table className="table table-bordered full">
      <thead>
        <tr>
          <th scope="col">Key</th>
          <th scope="col" style={{ width: '100%' }}>Value</th>
        </tr>
      </thead>
      <tbody>
        {fields.map(([name, value], i) => (
          <tr key={`${i}-${name}`}>
            <th scope="row">
              <div className="d-flex flex-column h-100 mh-100 justify-space-between align-items-start gap-2 lh-base">
                <pre className="p-0 m-0 font-monospace text-black fw-bold text-start lh-base">
                  {name}
                </pre>

                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 m-0 text-body-tertiary fw-bold text-start lh-base"
                  onClick={() => navigator.clipboard.writeText(name)}
                  title={`Click to copy "${name}" to clipboard`}
                >
                  Copy
                </button>
              </div>
            </th>
            <td>
              <div className="d-flex flex-column h-100 mh-100 justify-space-between align-items-start gap-2 lh-base">
                <div className="lh-base">
                  <span className="FieldsTable-value font-monospace">{value}</span>
                  <span className="FieldsTable-length">{` (${value.length})`}</span>
                </div>

                <button
                  type="button"
                  className="btn btn-link btn-sm p-0 m-0 text-body-tertiary fw-bold text-start lh-base"
                  onClick={() => navigator.clipboard.writeText(value)}
                  title={`Click to copy the value of "${name}" to clipboard`}
                >
                  Copy
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
