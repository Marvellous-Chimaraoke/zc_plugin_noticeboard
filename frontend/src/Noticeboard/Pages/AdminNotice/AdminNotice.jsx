import React, { useEffect, useContext, useState } from "react";
import notice from "../../../assets/createNotice.svg";
import noNotice from "../../../assets/no_notices.svg";
import "./AdminNotice.css";
import Card from "../../Components/NoticeBoard/Card/Card";
import { Button } from "@material-ui/core";
import logo from "../../../assets/logo.svg";
import { withRouter, Link } from "react-router-dom";
import { UserContext } from "../../../Context/Data-fetcing";
import { UserInfoContext } from "../../../App";
import { BookmarkContext } from "../../../Context/BookmarkContext";

const PinnedNotices = (props) => {
  const {
    people,
    setPeople,
    loading,
    setLoading,
    isError,
    setIsError,
    searchText,
    filteredNotice,
  } = useContext(UserContext);

  // const today = new Date();
  // const date = today.getDate();
  const date = new Date();
  const currentDate = date.getDate();

  // Read Organization ID
  const org_Id = localStorage.getItem("currentWorkspace");

  useEffect(() => {
    fetch(`https://noticeboard.zuri.chat/api/v1/organisation/${org_Id}/notices`)
      .then((res) => {
        if (res.status >= 200 && res.status <= 299) {
          return res.json();
        } else {
          setLoading(false);
          setIsError(true);
        }
      })
      .then((data) => {
        setPeople(
          data.data.filter(
            (notice) => currentDate == notice.created.slice(8, 10)
          )
        );

        setLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  //Bookmark
  const { bookmarkDetails, setBookmarkDetails, toggleBookmark } =
    useContext(BookmarkContext);
  let user = JSON.parse(sessionStorage.getItem("user"));
  const fetchBookmarked = () => {
    fetch(
      `https://noticeboard.zuri.chat/api/v1/organisation/${org_Id}/user/${user.id}/bookmark`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "success") {
          setBookmarkDetails(data);
        }
      });
  };

  useEffect(() => {
    fetchBookmarked();
  }, [toggleBookmark]);

  if (loading) {
    return (
      <div className="preloader">
        <img className="logo" src={logo} alt="logo" />
        <h1 className="isLoading">Loading...</h1>
        <i className="fas fa-spinner fa-spin"></i>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="preloader">
        <img className="logo" src={logo} alt="logo" />
        <h1
          className="isError"
          style={{ color: "red", fontSize: "1.5rem", marginTop: "100px" }}
        >
          Error. Try refreshing your browser
        </h1>
        <i className="fas fa-spinner fa-spin"></i>
      </div>
    );
  }

  if (people?.length <= 0 || people === null) {
    return (
      <div className="adminnotice">
        <div className="pinned-button-container">
          <div className="pin-text">
            <p className="text">Notices</p>
          </div>
          <Button
            className="header-button"
            color="primary"
            onClick={() => props.history.push("/noticeboard/create-notice")}
            variant="contained"
            disableRipple
          >
            Create Notice <img src={notice} alt="create notice" />
          </Button>
        </div>
        <div className="no-notice">
          <img src={noNotice} alt="no-notice" className="no-notice-img" />
          <h1 className="no-new-notices">
            Hey there, You have no notice for the day, they would appear here
            when published
          </h1>
          <div className="notice-btn-div">
            {/* <Link to="/noticeboard">
              <div className="older-notices">
                <p className="older-notices-text">Go Back</p>
              </div>
            </Link> */}

            <Link to="/noticeboard/old-notices">
              <div className="older-notices">
                <p className="older-notices-text">
                  <span>View older notices</span>
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }else{
  return (
    <div className="adminnotice">
      <div className="pinned-button-container">
        <div className="pin-text">
          <p className="text">Notices</p>
        </div>
        <Button
          className="header-button"
          onClick={() => props.history.push("/noticeboard/create-notice")}
          variant="contained"
          disableRipple
        >
          Create Notice <img src={notice} alt="create notice" />
        </Button>
      </div>
      {/* the is the beginning of the section where the card for each notice starts from */}

      <section className="adminNotice-section">
        {searchText
          ? filteredNotice?.map((person) => {
              return <Card person={person} key={person._id} />;
            })
          : people?.map((person) => {
              return <Card person={person} key={person._id} />;
            })}
      </section>

      <Link to="/noticeboard/old-notices">
        <div className="older-notices">
          <p className="older-notices-text">View older notices</p>
        </div>
      </Link>
    </div>
  );
}
};

export default withRouter(PinnedNotices);
