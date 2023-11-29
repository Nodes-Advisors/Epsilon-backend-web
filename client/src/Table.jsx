const Table = ({ data }) => {

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Function to extract and format the first part of an email address (before '@')
  const extractName = (email) => {
    const name = email.split('@')[0];
    return capitalizeFirstLetter(name);
  };

  // Function to extract the domain part of an email address (after '@' but before the domain extension)
  const extractDomain = (email) => {
    const domain = email.split('@')[1];
    return domain.split('.')[0];
  };

  return (
    <table>
      <tbody>
        <tr>
          <th>Outbound Email Interactions</th>
        </tr>
        {data.map((item) => {
          const senderName = extractName(item.sender);
          const recipientName = extractName(item.toRecipients);
          const recipientDomain = extractDomain(item.toRecipients);

          return (
            <tr key={item.id}>
              <td>{senderName} connected with {recipientName} at {recipientDomain} about {item.subject}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
