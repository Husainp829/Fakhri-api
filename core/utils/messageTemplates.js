const bookingCreationTemplate = `
Salaam-e-Jameel,

*{{organiser}}*, your booking has been confirmed.

📅 *Hall Bookings*:

{{#hallBookings}}
Hall - {{name}}
Date - {{formattedDate}}
Slot - {{slot}}
    
{{/hallBookings}}
{{#hallBookings}}
Hall - {{name}}
Date - {{formattedDate}}
Slot - {{slot}}
    
{{/hallBookings}}

-------------------------

{{#rentReceipt}}
🧾 *Contribution Receipt*: 
[Click here to view]({{{url}}})
{{/rentReceipt}}

{{#depositReceipt}}
💰 *Deposit Receipt*:
[Click here to view]({{{url}}})
{{/depositReceipt}}

Shukran.
`;

module.exports = {
  bookingCreationTemplate,
};
