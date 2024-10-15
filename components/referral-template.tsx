import * as React from "react";
import dayjs from "dayjs";

export const ReferralTemplate: React.FC<Readonly<any>> = ({ data }) => (
  <div>
    <h1>New Referral - {data.app_ref_friendly}</h1>
    <hr></hr>
    <h2>Due: {dayjs(data.due_date).format("DD MMMM YYYY")}</h2>
    <hr></hr>
    <h2>Referral Details</h2>
    <p>Officer: {data.officer}</p>
    <p>LGA: {data.org}</p>
    <p>Status: {data.status}</p>
    <p>Comment: {data.comment}</p>
    <p>Attachments: {data.file_url}</p>
    <p>Referral Date: {data.send_date}</p>
    <hr></hr>
    <h2>Responding</h2>
    <p>
      Login using the following PIN Code and link to submit a formal response.
    </p>
    <p>PIN Code: {data.pin}</p>
    <a href={`https://preview.v2.easy-assess.com/external/${data._id}`}>
      Portal Login
    </a>
  </div>
);

export const ReminderTemplate: React.FC<Readonly<any>> = ({ data }) => (
  <div>
    <h1>Reminder: Referral Awaiting Response - {data.app_ref_friendly}</h1>
    <hr></hr>
    <h3>
      This is an automated reminder that a response for this referral is due in
      seven (7) days.
    </h3>
    <hr></hr>
    <h2>Due: {data.due_date}</h2>
    <hr></hr>
    <h2>Referral Details</h2>
    <p>Officer: {data.officer}</p>
    <p>LGA: {data.org}</p>
    <p>Status: {data.status}</p>
    <p>Comment: {data.comment}</p>
    <p>Attachments: {data.file_url}</p>
    <p>Referral Date: {data.send_date}</p>
    <hr></hr>
    <h2>Responding</h2>
    <p>
      Login using the following PIN Code and link to submit a formal response.
    </p>
    <p>PIN Code: {data.pin}</p>
    <a href={`https://preview.v2.easy-assess.com/external/${data._id}`}>
      Portal Login
    </a>
  </div>
);

export const OverdueTemplate: React.FC<Readonly<any>> = ({ data }) => (
  <div>
    <h1>Overdue: Referral Awaiting Response - {data.app_ref_friendly}</h1>
    <hr></hr>
    <h3>
      This is an automated reminder that your response is now overdue. Please
      prepare a response as soon as possible, or contact the Local Authority for
      further details.
    </h3>
    <hr></hr>
    <h2>Due: {data.due_date}</h2>
    <hr></hr>
    <h2>Referral Details</h2>
    <p>Officer: {data.officer}</p>
    <p>LGA: {data.org}</p>
    <p>Status: {data.status}</p>
    <p>Comment: {data.comment}</p>
    <p>Attachments: {data.file_url}</p>
    <p>Referral Date: {data.send_date}</p>
    <hr></hr>
    <h2>Responding</h2>
    <p>
      Login using the following PIN Code and link to submit a formal response.
    </p>
    <p>PIN Code: {data.pin}</p>
    <a href={`https://preview.v2.easy-assess.com/external/${data._id}`}>
      Portal Login
    </a>
  </div>
);
