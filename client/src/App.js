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
  const [senders, setSenders] = useState([]);
  const [investorEmails, setInvestorEmails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5001?q=${query}`);
      setData(res.data);
      setFilteredData(res.data);

      // Extract unique senders
      const uniqueSenders = [...new Set(res.data.map(item => item.sender))];
      setSenders(uniqueSenders);

      // Extract investor emails
      const investorEmails = [...new Set(res.data.map(item => (item.isInvestorEmail).toString()))];
      setInvestorEmails(investorEmails);
    };
    if (query.length === 0 || query.length > 2) fetchData();
  }, [query]);

  // Filter by each unique sender
  const filterBySender = (sender) => {
    const filteredSender = data.filter(item => item.sender === sender);
    setFilteredData(filteredSender);
  };

  // Filter by whether the emails isInvestorEmail
  const filterByInvestorEmail = (investors) => {
    const filteredInvestor = data.filter(item => (item.isInvestorEmail).toString() === investors);
    setFilteredData(filteredInvestor);
  };

  return (
    <div className="app">

      {/* Side bar buttons for selecting senders */}
      <div className="sidebar">
        {senders.map(sender => (
          <button key={sender} onClick={() => filterBySender(sender)}>
            {sender}
          </button>
        ))}
      </div>

      {/* Side bar buttons for selecting investor emails (true / false) */}
      <div className="sidebar">
        {investorEmails.map(investors => (
          <button key={investors} onClick={() => filterByInvestorEmail(investors)}>
            {investors}
          </button>
        ))}
      </div>

      {/* Search bar and display info table */}
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
