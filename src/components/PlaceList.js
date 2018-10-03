import React, { Component } from "react";

class PlaceList extends Component {
  state = {
    cursor: null
  };

  // call the function to select the list item
  // if the user clicks on it with the mouse
  handleClick(place, index) {
    this.setState({
      cursor: index
    });
    this.props.selectPlaceFromList(place);
  }

  // if the user shifts the focus on the listbox, and there isn't a selected item,
  // the first item of the list is automatically selected
  handleFocus = e => {
    setTimeout(() => {
      const { cursor } = this.state;
      if (cursor === null) {
        // set time out to prevent the focus function to run before the click function,
        // causing both the element selected with the mouse and by the focus
        // to animate temporarily
        this.setState({
          cursor: 0
        });
        this.props.selectLiWithKeyboard(0);
      }
    }, 200);
  };

  // move the cursor up and down according to the arrow keys pressed
  handleKeyDown = e => {
    const { cursor } = this.state;
    if (e.keyCode === 38 && cursor > 0) {
      e.preventDefault();
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }));
      this.props.selectLiWithKeyboard(cursor - 1);
    } else if (
      e.keyCode === 40 &&
      cursor < this.props.showingPlaces.length - 1
    ) {
      e.preventDefault();
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }));
      this.props.selectLiWithKeyboard(cursor + 1);
    }
  };

  // update the query based on the value of the input
  updateQuery(query) {
    this.setState({
      cursor: null
    });
    this.props.queryFilter(query.trim());
  }

  // called onclick or after handleKeyDownOnClear() onkeydown.
  // reset the cursor, and call another function on Mapcontainer
  // to clear the query
  handleClearQuery = () => {
    this.setState({
      cursor: null
    });
    this.props.clearQuery();
  };

  // function that checks which key has been pressed
  // while the clear query icon is selected.
  // if it's enter or space, it will call handleClearQuery to clear the query
  handleKeyDownOnClear = e => {
    // if the key pressed is either enter or the space bar
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
      this.handleClearQuery();
    }
  };

  render() {
    const {
      classList,
      neighborhoodName,
      cityName,
      menuOpen,
      query,
      activeMarker,
      allPlaces
    } = this.props;
    return (
      <nav
        id="drawer"
        className={classList}
        role="complementary"
        aria-labelledby="listboxTitle"
      >
        <h2 id="listboxTitle" className="place-list__title">
          Favorite places
        </h2>
        <p className="place-list__description">
          A list of my favorite places in {neighborhoodName}, {cityName}.
        </p>
        <div className="input__container">
          <input
            type="text"
            placeholder="Search for name"
            className="search-places"
            onChange={e => this.updateQuery(e.target.value)}
            aria-label="Search"
            tabIndex={menuOpen ? "0" : "-1"}
            value={query}
          />
          <a
            id="clearQuery"
            role="button"
            aria-label="Clear Searchbox"
            onClick={this.handleClearQuery}
            onKeyDown={this.handleKeyDownOnClear}
          >
            <svg
              tabIndex="0"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </a>
        </div>
        <ul
          className="place-list__list"
          role="listbox"
          aria-label="Places list"
          aria-activedescendant={activeMarker ? activeMarker.id : "none"}
          tabIndex={menuOpen ? "0" : "-1"}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
        >
          {allPlaces.map((place, index) => (
            <li
              key={index}
              id={place.id}
              className={
                activeMarker && activeMarker.id === place.id
                  ? "place-list__item selected-li"
                  : "place-list__item"
              }
              onClick={() => this.handleClick(place, index)}
              role="option"
              aria-selected={
                activeMarker && activeMarker.id === place.id ? true : false
              }
            >
              {place.name}
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default PlaceList;