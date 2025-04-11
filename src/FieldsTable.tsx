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
              <button
                type="button"
                className="btn btn-link p-0 font-monospace text-black fw-bold"
                onClick={() => navigator.clipboard.writeText(value)}
                title={`Click to copy the value of "${name}" to clipboard`}
              >
                {name}
              </button>
            </th>
            <td>
              <span className="FieldsTable-value">{value}</span>
              <span className="FieldsTable-length">{` (${value.length})`}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
