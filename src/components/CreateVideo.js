import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { SpinnerDiv, Spinner } from "../styled-components/spinner";
import style from "styled-components";
import { postVideo } from "../store/actions";
import AdvancedOptions from "../components/AdvancedOptions";

const API_URL =
  "https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=";

const ContentCenter = style.div`
  margin: 0 auto;
  display: block;
  width: 30%;
  padding-bottom: 300px;
`;

const CreateVideoLabel = style.label`
  padding: 10px 15px;
  color: #44E0F6;
  font-size: 18px;
  display: block;
  font-weight: 800;
`;

const VideoList = style.ul`
  padding: 10px 15px;
  color: #44E0F6;
  font-size: 18px;
  display: block;
  font-weight: 800;
  list-style-type: none;
`;

const VideoInput = style.input`
  padding: 10px 15px;
  border: 2px solid #FCFC0B;
  border-radius: 8px;
  color: #FCFC0B;
  font-size: 24px;
  background-color: #0E0429;
  display: block;
  width: 100%;
  &:focus {
    border: 2px solid #44E0F6;
    outline: none;
  }
`;

const SelectedSong = style.div`
  padding: 10px 15px;
  border-radius: 8px;
  color: #FCFC0B;
  font-size: 20px;
  background-color: #0E0429;
  display: block;
  text-align: center;
  width: 100%;
`;

const VideoButton = style.button`
  padding: 20px 30px;
  color: #0E0429;
  border-radius: 8px;
  font-size: 18px;
  display: block;
  font-weight: 800;
  width: 100%;
  margin-top: 20px;
  border: 2px solid #FCFC0B;
  cursor: pointer;
  background: rgb(250,112,239);
  background: linear-gradient(180deg, rgba(250,112,239,1) 0%, rgba(254,235,251,1) 100%, rgba(2,0,36,1) 190755%);
  &:hover {
    background: rgb(254,235,251);
    background: radial-gradient(circle, rgba(254,235,251,1) 0%, rgba(250,112,239,1) 100%, rgba(2,0,36,1) 190755%);
  }
`;

const CreateVideo = (props) => {
  // const [video, setVideo] = useState({
  //   title: "",
  //   song: "",
  //   artist: ""
  // });

  // const handleChanges = event => {
  //   setVideo({ ...video, [event.target.name]: event.target.value });
  //   console.log(event.target.name);
  // };

  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [videoTitle, setVideoTitle] = useState("");

  const [songLoading, setSongLoading] = useState(false);

  const [titleLoading, setTitleLoading] = useState(false);

  const [optionsClicked, setOptionsClicked] = useState(false);

  // const [jitHover, setJitHover] = useState(false);
  // const [deepHover, setDeepHover] = useState(false);
  // const [truncateHover, setTruncateHover] = useState(false);
  // const [pitchHover, setPitchHover] = useState(false);
  // const [tempoHover, setTempoHover] = useState(false);
  // const [smoothHover, setSmoothHover] = useState(false);

  // const [videoParams, setVideoParams] = useState({
  //   im_group: "RANDOM OBJECTS",
  //   jitter: 0.5,
  //   depth: 1,
  //   truncation: 0.5,
  //   pitch_sensitivity: 220,
  //   tempo_sensitivity: 0.25,
  //   smooth_factor: 20,
  // });

  const [selectedSong, setSelectedSong] = useState({
    title_short: "",
    preview: "",
    artist: "",
    deezer_id: "",
    location: "youtube.com/video",
    video_title: "",
    user_id: localStorage.getItem("user_id"),
  });

  const fullQuery = `${API_URL}${query}`;

  const getInfo = () => {
    console.log(fullQuery);
    axiosWithAuth()
      .get(`${fullQuery}&limit=7`)
      .then((res) => {
        console.log("res", res);
        setResults(res.data.data);
      })
      .catch((err) => {
        console.log("unable to suggest artist and/or song", err);
      });
  };

  useEffect(() => {
    if (query.length >= 2) getInfo();
  }, [query]);

  const handleSongChange = (event) => {
    setSongLoading(true);
    setQuery(event.target.value);
  };

  const handleTitleChange = (event) => {
    setVideoTitle({ [event.target.name]: event.target.value });
    setTitleLoading(true);
  };

  const handleClickSong = (event) => {
    const songItem = event.target.getAttribute("data-index");
    setSelectedSong({
      ...selectedSong,
      title_short: results[songItem].title_short,
      preview: results[songItem].preview,
      artist: results[songItem].artist.name,
      deezer_id: results[songItem].id,
      video_title: videoTitle.title,
      // im_group: videoParams.im_group,
      // jitter: videoParams.jitter,
      // depth: videoParams.depth,
      // truncation: videoParams.truncation,
      // pitch_sensitivity: videoParams.pitch_sensitivity,
      // tempo_sensitivity: videoParams.tempo_sensitivity,
      // smooth_factor: videoParams.smooth_factor,
    });

    setSongLoading(false);
  };

  const submitForm = (event) => {
    event.preventDefault();
    // Need to create postVideo action in redux for this to work
    console.log(selectedSong);
    props.postVideo(localStorage.getItem("token"), selectedSong, props.history);
  };

  const handleClickOptions = (event) => {
    event.preventDefault();
    const optionsClicked_new = !optionsClicked;
    setOptionsClicked(optionsClicked_new);
  };

  // const handleSliderChange = (event) => {
  //   setVideoParams({
  //     ...videoParams,
  //     [event.target.name]: Number(event.target.value),
  //   });
  // };

  // const handleReset = (event) => {
  //   event.preventDefault();
  //   setVideoParams({
  //     jitter: 0.5,
  //     depth: 1,
  //     truncation: 0.5,
  //     pitch_sensitivity: 220,
  //     tempo_sensitivity: 0.25,
  //     smooth_factor: 20,
  //   });
  // };

  // const handleJitHover = (event) => {
  //   setJitHover(!jitHover);
  //   console.log(event.target.hover);
  // };

  // const handleDeepHover = (event) => {
  //   setDeepHover(!deepHover);
  // };

  // const handleTruncateHover = (event) => {
  //   setTruncateHover(!truncateHover);
  // };

  // const handlePitchHover = (event) => {
  //   setPitchHover(!pitchHover);
  // };

  // const handleTempoHover = (event) => {
  //   setTempoHover(!tempoHover);
  // };

  // const handleSmoothHover = (event) => {
  //   setSmoothHover(!smoothHover);
  // };

  const handleVideoParams = (event) => {
    setSelectedSong({
      ...selectedSong,
      [event.name]: event.value,
    });
    console.log(selectedSong)
  }

  const handleTest = (e) => {
    e.preventDefault();
    console.log(AdvancedOptions.params);
  }

  return (
    <>
    <button onClick={handleTest} >CLICK ME!!!</button>
      <ContentCenter>
        <form onSubmit={submitForm}>
          <CreateVideoLabel htmlFor="title">Title</CreateVideoLabel>
          <VideoInput
            required
            id="title"
            name="title"
            placeholder="Title Your Video"
            type="text"
            onChange={handleTitleChange}
          />
          <CreateVideoLabel htmlFor="title">Song</CreateVideoLabel>
          <VideoInput
            placeholder="Search Artist and/or Song Title"
            onChange={handleSongChange}
          />

          <VideoList>
            {results && results.length > 0
              ? results.map((res, index) => (
                  <li onClick={handleClickSong} key={index} data-index={index}>
                    {res.artist.name} - {res.title}
                  </li>
                ))
              : console.log("broken")}
          </VideoList>
          <div className="selected_song">
            {selectedSong.artist !== "" && songLoading === false ? (
              <SelectedSong>
                <h3>
                  {selectedSong.artist} - {selectedSong.title_short}
                </h3>
              </SelectedSong>
            ) : (
              console.log("Hi")
            )}
          </div>
          <div className="buttons">
            {selectedSong.artist !== "" &&
            videoTitle.title !== "" &&
            titleLoading === true &&
            songLoading === false ? (
              <div>
                <VideoButton type="submit">Submit</VideoButton>
                <VideoButton onClick={handleClickOptions}>Advanced</VideoButton>
              </div>
            ) : (
              console.log("Hi")
            )}
          </div>
          <div className="advanced_options">
              {optionsClicked === true ? (
                <AdvancedOptions onChange={handleVideoParams} />
              ) : (
                console.log("Hooray")
              )}
            
            {/* {optionsClicked === true ? (
              <div className="options">
                <VideoButton onClick={handleReset}>Reset Defaults</VideoButton>
                <div className="image_category">
                  <CreateVideoLabel>
                    Image Category
                    <select
                      onChange={(event) =>
                        setVideoParams({
                          ...videoParams,
                          im_group: event.target.value,
                        })
                      }
                    >
                      <option value="RANDOM OBJECTS">Pick One</option>
                      <option value="FISH">FISH</option>
                      <option value="BIRDS">BIRDS</option>
                      <option value="AMPHIBIANS">AMPHIBIANS</option>
                      <option value="LIZARDS">LIZARDS</option>
                      <option value="SNAKES">SNAKES</option>
                      <option value="OCTOPED">OCTOPED</option>
                      <option value="EXOTIC BIRDS">EXOTIC BIRDS</option>
                      <option value="WEIRD MAMMALS">WEIRD MAMMALS</option>
                      <option value="SQUISHY SEA CREATURES">
                        SQUISHY SEA CREATURES
                      </option>
                      <option value="SHELLED SEA CREATURES">
                        SHELLED SEA CREATURES
                      </option>
                      <option value="FANCY BIRDS">FANCY BIRDS</option>
                      <option value="SEA MAMMALS">SEA MAMMALS</option>
                      <option value="UGLY DOGS">UGLY DOGS</option>
                      <option value="HOUND DOGS">HOUND DOGS</option>
                      <option value="TERRIER DOGS">TERRIER DOGS</option>
                      <option value="RETRIEVER DOGS">RETRIEVER DOGS</option>
                      <option value="RANDOM DOGS">RANDOM DOGS</option>
                      <option value="WOLVES">WOLVES</option>
                      <option value="HYAENAS">HYAENAS</option>
                      <option value="FOXY">FOXY</option>
                      <option value="DOMESTIC CATS">DOMESTIC CATS</option>
                      <option value="BIG CATS">BIG CATS</option>
                      <option value="BEAR">BEAR</option>
                      <option value="UNDERGROUND CATS">UNDERGROUND CATS</option>
                      <option value="BEETLES">BEETLES</option>
                      <option value="FLYING INSECTS">FLYING INSECTS</option>
                      <option value="BUTTERFLIES">BUTTERFLIES</option>
                      <option value="SHARP SEA STUFF">SHARP SEA STUFF</option>
                      <option value="SMALL MAMMALS">SMALL MAMMALS</option>
                      <option value="LARGE WILD ANIMALS">
                        LARGE WILD ANIMALS
                      </option>
                      <option value="RANDOM MAMMALS">RANDOM MAMMALS</option>
                      <option value="PRIMATES">PRIMATES</option>
                      <option value="AFRICAN ANIMALS">AFRICAN ANIMALS</option>
                      <option value="PANDAS">PANDAS</option>
                      <option value="CRAZY SEA CREATURES">
                        CRAZY SEA CREATURES
                      </option>
                      <option value="RANDOM OBJECTS">RANDOM OBJECTS</option>
                      <option value="WORDS AND SIGNS">WORDS AND SIGNS</option>
                      <option value="FOOD STUFF">FOOD STUFF</option>
                      <option value="GEOLOGICAL STUFF">GEOLOGICAL STUFF</option>
                      <option value="PEOPLE">PEOPLE</option>
                      <option value="FLOWERING THINGS">FLOWERING THINGS</option>
                      <option value="FUNGI">FUNGI</option>
                      <option value="TOILET PAPER">TOILET PAPER</option>
                    </select>
                  </CreateVideoLabel>
                </div>
                <div className="jitter">
                  <CreateVideoLabel>
                    Jitter
                    <div
                      onMouseEnter={handleJitHover}
                      onMouseLeave={handleJitHover}
                    >
                      ?
                    </div>
                    {jitHover && (
                      <div>
                        Prevents the same exact images from cycling repetitively
                        during repetitive music so that the video output is more
                        interesting. If you do want to cycle repetitively, set
                        jitter to minimum.
                      </div>
                    )}
                    <input
                      type="range"
                      name="jitter"
                      min={0}
                      max={1}
                      step="0.05"
                      value={videoParams.jitter}
                      onChange={handleSliderChange}
                    />
                  </CreateVideoLabel>
                </div>
                <div className="depth">
                  <CreateVideoLabel>
                    Depth
                    <div
                      onMouseEnter={handleDeepHover}
                      onMouseLeave={handleDeepHover}
                    >
                      ?
                    </div>
                    {deepHover && (
                      <div>
                        Max yields more thematically rich content. Lowering
                        yields more 'deep' structures like human and dog faces.
                        However, this depends heavily on the specific classes
                        you are using.
                      </div>
                    )}
                    <input
                      type="range"
                      name="depth"
                      min={0.1}
                      max={1}
                      step="0.05"
                      value={videoParams.depth}
                      onChange={handleSliderChange}
                    />
                  </CreateVideoLabel>
                </div>
                <div className="truncation">
                  <CreateVideoLabel>
                    Truncation
                    <div
                      onMouseEnter={handleTruncateHover}
                      onMouseLeave={handleTruncateHover}
                    >
                      ?
                    </div>
                    {truncateHover && (
                      <div>
                        Controls the variability of images generated. Max value
                        yield more variable images, while lower values yield
                        simpler images with more recognizable, normal-looking
                        objects.
                      </div>
                    )}
                    <input
                      type="range"
                      name="truncation"
                      min={0.1}
                      max={1}
                      step="0.05"
                      value={videoParams.truncation}
                      onChange={handleSliderChange}
                    />
                  </CreateVideoLabel>
                </div>
                <div className="pitch">
                  <CreateVideoLabel>
                    Pitch Sensitivity
                    <div
                      onMouseEnter={handlePitchHover}
                      onMouseLeave={handlePitchHover}
                    >
                      ?
                    </div>
                    {pitchHover && (
                      <div>
                        Controls how rapidly the thematic content of the video
                        will react to changes in pitch.
                      </div>
                    )}
                    <input
                      type="range"
                      name="pitch_sensitivity"
                      min={200}
                      max={295}
                      step="5"
                      value={videoParams.pitch_sensitivity}
                      onChange={handleSliderChange}
                    />
                  </CreateVideoLabel>
                </div>
                <div className="tempo">
                  <CreateVideoLabel>
                    Tempo Sensitivity
                    <div
                      onMouseEnter={handleTempoHover}
                      onMouseLeave={handleTempoHover}
                    >
                      ?
                    </div>
                    {tempoHover && (
                      <div>
                        Controls how rapidly the overall size, position, and
                        orientation of objects in the images will react to
                        changes in volume and tempo.{" "}
                      </div>
                    )}
                    <input
                      type="range"
                      name="tempo_sensitivity"
                      min={0.05}
                      max={0.8}
                      step="0.05"
                      value={videoParams.tempo_sensitivity}
                      onChange={handleSliderChange}
                    />
                  </CreateVideoLabel>
                </div>
                <div className="smooth">
                  <CreateVideoLabel>
                    Smooth Factor
                    <div
                      onMouseEnter={handleSmoothHover}
                      onMouseLeave={handleSmoothHover}
                    >
                      ?
                    </div>
                    {smoothHover && (
                      <div>
                        Small local fluctuations in pitch can cause the video
                        frames to fluctuate back and forth. If you want to
                        visualize very fast music with rapid changes in pitch,
                        lower the smooth factor.
                      </div>
                    )}
                    <input
                      type="range"
                      name="smooth_factor"
                      min={10}
                      max={30}
                      step="1"
                      value={videoParams.smooth_factor}
                      onChange={handleSliderChange}
                    />
                  </CreateVideoLabel>
                </div>
              </div>
            ) : (
              console.log("Hooray")
            )} */}
          </div>
        </form>
        {props.postVideoStart && (
          <SpinnerDiv>
            <Spinner color="success" />
          </SpinnerDiv>
        )}
      </ContentCenter>
    </>
  );
};

const mapStateToProps = (state) => ({
  videos: state.videos,
  postVideoError: state.postVideoError,
  postVideoStart: state.postVideoStart,
});

// export default connect(mapStateToProps, { postVideo })(withRouter(CreateVideo));

export default connect(mapStateToProps, {
  postVideo,
})(withRouter(CreateVideo));

// export default connect(mapStateToProps, {})(
//   withRouter(CreateVideo)
// );
