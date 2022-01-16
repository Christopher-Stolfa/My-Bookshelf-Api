const googleBooks = require("../Services/googleBooks.services");

const bookSearch = (req, res) => {
  const { searchQuery, maxResults, startIndex, orderBy } = JSON.parse(
    req.query.data
  );
  console.log(searchQuery);

  googleBooks
    .searchBooks(searchQuery, maxResults, startIndex, orderBy)
    .then((response) => {
      res.status(200).json({
        message: "Search successful.",
        bookSearchData: response.data.items.map((item) => item),
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: err.toString(),
      });
    });

  // if (req.session.user) {
  //   console.log(req.session.user);
  //   const { id, email, displayName, firstName, lastName } = req.session.user;
  //   const userData = { id, email, displayName, firstName, lastName };
  //   res.status(200).json({
  //     message: "Login session exists.",
  //     loggedIn: true,
  //     userData: userData
  //   });
  // } else {
  //   res.status(200).json({ message: "No session exists.", loggedIn: false });
  // }
};

module.exports = { bookSearch };
