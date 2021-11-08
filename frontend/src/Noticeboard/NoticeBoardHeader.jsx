/* eslint-disable operator-linebreak */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
/* eslint-disable no-console */
import React, { useState, useContext, useEffect } from 'react';
// import styled from "styled-components";
import './NoticeBoardHeader.css';
import Parcel from 'single-spa-react/parcel';
import { pluginHeader } from '@zuri/plugin-header';
import axios from 'axios';
import NoticeboardIcon from '../assets/noticeboard.svg';
import noNotification from '../assets/noNotification.svg';
import { UserInfoContext } from '../App';
import { UserContext } from '../Context/Data-fetcing';

function ZuriGlobalHeader() {
  const { allUsers, setAllUsers } = useContext(UserContext);
  const userData = useContext(UserInfoContext);
  const [notificationTab, setNotificationTab] = useState(false);

  const toggleNotificationTab = () => {
    setNotificationTab(!notificationTab);
  };

  const getAllUsers = async () => {
    try {
      const requestOptions = {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await fetch(
        `https://api.zuri.chat/organizations/${userData?.currentWorkspace}/members`,
        requestOptions,
      );
      const data = await response.json();
      setAllUsers(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [userData]);

  const [roomDetails, setRoomDetails] = useState([]);

  /* Room Information api */
  const api = axios.create({
    baseURL: 'https://noticeboard.zuri.chat/api/v1',
  });

  const org_Id = localStorage.getItem('currentWorkspace');

  const getRoomDetails = async () => {
    try {
      const res = await api.get(`/organisation/${org_Id}/get-room`);

      const data = await res.data;

      const roomApi = data.data[0];

      setRoomDetails(roomApi);
      // console.log(roomApi, roomApi.room_id, roomApi.room_member_id[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  /* add member api */
  // room object
  const member_id = userData?._id;

  // eslint-disable-next-line prefer-destructuring
  const room_id = roomDetails.room_id;

  const room_length = roomDetails.room_member_id?.length;

  const users =
    allUsers?.map((user) => ({
      _id: user._id,
      email: user.email,
    })) ?? [];

  const members = roomDetails.room_member_id;

  const getRoomMembersById = (member_ids) =>
    // eslint-disable-next-line implicit-arrow-linebreak
    users
      .filter((user) => member_ids.includes(user._id))
      .map((member) => ({
        _id: member._id,
        email: member.email,
      }));

  let membersList = getRoomMembersById(members);

  const headerConfig = {
    name: 'NOTICEBOARD', // Name on header
    icon: NoticeboardIcon, // Image on header
    thumbnailUrl: [], // Replace with images of users
    userCount: room_length, // User count on header
    hasThumbnail: true, // set false if you don't want thumbnail on the header
    roomInfo: {
      // eslint-disable-next-line object-shorthand
      membersList: membersList,
      addmembersevent(values) {
        const member_ids = values.map((value) => value.value);

        const payload = {
          room_id,
          member_ids,
        };

        const addToRoom = async () => {
          try {
            const res = await api.post(
              `/organisation/${org_Id}/room/${room_id}/members/${member_id}`,
              payload,
            );

            const newRoomMembers = getRoomMembersById(member_ids);
            membersList = [...newRoomMembers, ...membersList];

            headerConfig.userCount = membersList.length;
            headerConfig.roomInfo.membersList = [...membersList];
            console.log(membersList);
            return res;
          } catch (err) {
            console.log(err);
          }
        };

        addToRoom();
      },
      removememberevent(id) {
        const member_ids = [id];

        const payload = {
          room_id,
          member_ids,
        };

        // eslint-disable-next-line consistent-return
        const removeFromRoom = async () => {
          try {
            const res = await api.patch(
              `/organisation/${org_Id}/room/${room_id}/members/${member_id}`,
              payload,
            );
            console.log(res);

            membersList = membersList.filter(
              (member) => !member_ids.includes(member._id),
            );
            headerConfig.userCount = membersList.length;
            headerConfig.roomInfo.membersList = [...membersList];

            console.log(membersList);
            return res;
          } catch (err) {
            console.log(err);
          }
        };

        removeFromRoom();
      },
    },
  };

  return (
    <div className="zuriMain-header">
      <Parcel
        config={pluginHeader}
        wrapWith="div"
        wrapStyle={{ width: '100%' }}
        headerConfig={headerConfig}
      />

      <div className="noNotification-container">
        <img
          src={noNotification}
          alt="noNotification"
          onClick={toggleNotificationTab}
        />
      </div>
      {notificationTab && <NotificationTab />}
    </div>
  );
}

const NotificationTab = () => (
  <div className="notificationTab">
    <div className="notificationTab-innerContainer">
      <p className="notificationTab-intro">
        You set a reminder for this notice
      </p>
      <div className="notificationTab-title-time">
        <h3 className="notificationTab-title">Staff Meeting</h3>
        <p className="notificationTab-time">13:00</p>
      </div>
      <div>
        <button type="button" className="notificationTab-button">
          View Notice
        </button>
      </div>
    </div>
  </div>
);

export default ZuriGlobalHeader;
