import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";
import humanizeDuration from "humanize-duration";
import { dummyCourses } from "../assets/assets";

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [showLogin, setShowLogin] = useState(false);
  const [isEducator, setIsEducator] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // fetch all Cources
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Function to clculte rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // Function to Calculate Course Chapter Time
  const calculateChapterTime = (chapter) => {
    let time = 0;

    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));

    return humanizeDuration(time * 60 * 10, { units: ["h", "m", "s"] });
  };

  // Function to Calculate Course Duration
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );

    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Function to calculate the number of lectures in the course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // Fetch User Enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    // const token = await getToken();

    // const { data } = await axios.get(
    //   backendUrl + "/api/user/enrolled-courses",
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );

    // if (data.success) {
    //   setEnrolledCourses(data.enrolledCourses.reverse());
    // } else toast.error(data.message);

    setEnrolledCourses(dummyCourses);
  };



  useEffect(() => {
    fetchAllCourses()
    fetchUserEnrolledCourses()
  }, []);

  const value = {
    showLogin,
    setShowLogin,
    backendUrl,
    currency,
    navigate,
    userData,
    setUserData,
    getToken,
    allCourses,
    fetchAllCourses,
    fetchUserEnrolledCourses,
    enrolledCourses,
    calculateChapterTime,
    calculateCourseDuration,
    calculateRating,
    calculateNoOfLectures,
    isEducator,
    setIsEducator,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
