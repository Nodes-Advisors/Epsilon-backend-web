// import { useEffect, useState } from "react";
// // import { Emails } from "./emails";
// import "./app.css";
// import Table from "./Table";
// import axios from "axios";

// //////////////////////BASIC SEARCH

// // function App() {
// //   const [query, setQuery] = useState("");
// //   return (
// //     <div className="app">
// //       <input
// //         className="search"
// //         placeholder="Search..."
// //         onChange={(e) => setQuery(e.target.value.toLowerCase())}
// //       />
// //       <ul className="list">
// //         {Emails.filter((asd) =>
// //           asd.subject.toLowerCase().includes(query)
// //         ).map((email) => (
// //           <li className="listItem" key={email.id}>
// //             {email.subject}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }

// /////////////////////SEARCH ON A DATATABLE

// // function App() {
// //   const [query, setQuery] = useState("");
// //   const keys = ["subject", "sender", "toRecipients"];
// //   const search = (data) => {
// //     return data.filter((item) =>
// //       keys.some((key) => item[key].toLowerCase().includes(query))
// //     );
// //   };
// // return (
// //   <div className="app">
// //       <input
// //         className="search"
// //         placeholder="Search..."
// //         onChange={(e) => setQuery(e.target.value.toLowerCase())}
// //       />
// //     {<Table data={search(Emails)} />}
// //   </div>
// // );
// // }


// ////////////////////// API SEARCH

// function App() {
//   const [query, setQuery] = useState("");
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get(`http://localhost:5001?q=${query}`);
//       setData(res.data);
//     };
//     if (query.length === 0 || query.length > 2) fetchData();
//   }, [query]);

//   return (
//     <div className="app">
//         <input
//           className="search"
//           placeholder="Search..."
//           onChange={(e) => setQuery(e.target.value.toLowerCase())}
//         />
//       {<Table data={data} />}
//     </div>
//   );
// }

// export default App;



import { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";
import "./app.css";

function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5001?q=${query}`);
      setData(res.data);
      setFilteredData(res.data);

      // Extract unique recipients
      const uniqueRecipients = [...new Set(res.data.map(item => item.toRecipients))];
      setRecipients(uniqueRecipients);
    };
    if (query.length === 0 || query.length > 2) fetchData();
  }, [query]);

  const filterByRecipient = (recipient) => {
    const filtered = data.filter(item => item.toRecipients === recipient);
    setFilteredData(filtered);
  };

  return (
    <div className="app">
      <div className="sidebar">
        {recipients.map(recipient => (
          <button key={recipient} onClick={() => filterByRecipient(recipient)}>
            {recipient}
          </button>
        ))}
      </div>

      <div className="main-content">
        <input
          className="search"
          placeholder="Search..."
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
        />
        <Table data={filteredData} />
      </div>
    </div>
  );
}

export default App;
