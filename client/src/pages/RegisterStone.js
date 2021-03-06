import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import Caver from "caver-js";
import service_abi from "../abi/Service";

export default function RegisterStone() {
  const [stoneName, setStoneName] = useState("");
  const state = useSelector((state) => state.accountReducer);
  const account = state.account;
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [stonefile, setStonefile] = useState(null);
  const [lyricist, setLyricist] = useState("");
  const [composer, setComposer] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [category, setCategory] = useState("default");
  const [album, setAlbum] = useState("");
  const [albumList, setAlbumList] = useState([]);
  const [SFTAmount, setSFTAmount] = useState(0);
  const [txHash, setTxHash] = useState("");
  const caver = new Caver(window.klaytn);
  const [tokenId, setTokenId] = useState("");
  var serviceAddress = process.env.REACT_APP_SERVICE_ADDRESS;
  const server =
    process.env.REACT_APP_SERVER_ADDRESS || "http://127.0.0.1:12367";
  let albumlist;

  useEffect(() => {
    async function req() {
      await axios
        .get(`${server}/stones/${account}`)
        .then((res) => {
          albumlist = res.data.data.albumList;
          console.log(albumlist);
          setAlbumList(albumlist);
        })
        .catch((e) => console.log(e));
    }
    req();
  }, []);
  const onChangeStoneName = (e) => {
    setStoneName(e.target.value);
  };
  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };
  const onChangeStoneFile = (e) => {
    setStonefile(e.target.files[0]);
  };
  const onChangeLyricist = (e) => {
    setLyricist(e.target.value);
  };
  const onChangeComposer = (e) => {
    setComposer(e.target.value);
  };
  const onChangeLyrics = (e) => {
    setLyrics(e.target.value);
  };
  const onChangeSFTAmount = (e) => {
    setSFTAmount(Number(e.target.value));
  };
  const mintSFT = async () => {
    const service = new caver.klay.Contract(
      service_abi,
      process.env.REACT_APP_SERVICE_ADDRESS
    );
    if (
      album &&
      stoneName &&
      account &&
      description &&
      stonefile &&
      lyricist &&
      composer &&
      lyrics &&
      SFTAmount
    ) {
      const tx = await service.methods
        .mintSFT(SFTAmount)
        .send({
          from: state.account,
          gas: 1000000,
        })
        .then((data) =>
          setTokenId(data.events.SFTMinted[0].returnValues.token_id)
        );
    } else if (album == "") {
      alert("????????? ??????????????????. ????????? ????????? ????????? ????????? ??????????????????.");
    } else if (!stoneName) {
      alert("????????? ??????????????????.");
    } else if (!account) {
      alert("????????? ??????????????????.");
    } else if (!description) {
      alert("???????????? ??????????????????.");
    } else if (!stonefile) {
      alert("??????????????? ??????????????????.");
    } else if (!lyricist) {
      alert("???????????? ??????????????????.");
    } else if (!composer) {
      alert("???????????? ??????????????????.");
    } else if (!lyrics) {
      alert("????????? ??????????????????.");
    } else if (!SFTAmount) {
      alert("????????? SFT ????????? ??????????????????.");
    }


  };
  const saveStone = async () => {
    const formData = new FormData();
    formData.append("albumId", album);
    formData.append("stoneName", stoneName);
    formData.append("description", description);
    formData.append("stonefile", stonefile);
    formData.append("lyricist", lyricist);
    formData.append("composer", composer);
    formData.append("lyrics", lyrics);
    formData.append("category", category);
    formData.append("totalBalance", SFTAmount);
    formData.append("tokenId", tokenId);
    await axios
      .post(`${server}/stones/register/${account}`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data.message);
        navigate("/stones/myStone");
      });

  };
  useEffect(() => {
    if (tokenId) {
      saveStone();
    }
  }, [tokenId]);
  return (
    <div>
      <div id="stoneregisterpage">
        <div>
          <span className="pagetitle">?????? ??????</span>
          <span>
            <Link to="/album/register" style={{ textDecoration: "none" }}>
              <button className="albumbtn"> ?????? ?????? </button>
            </Link>
          </span>
        </div>
        {state.isConnect ? (
          <div>
            <div className="text">?????? ????????? ?????? ?????? :</div>
            <div>{state.account}</div>
          </div>
        ) : (
          <div className="text">????????? ?????? ???????????????.</div>
        )}
        <div>
          <select
            className="Aselectbox"
            onChange={(e) => {
              const selectedAlbum = e.target.value;
              setAlbum(selectedAlbum);
            }}
          >
            <option value="">????????? ??????????????????.</option>
            {albumList.map((e) => {
              return (
                <option e={e} value={e.id}>
                  {e.name}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <input
            className="fileinput"
            type="file"
            onChange={(e) => onChangeStoneFile(e)}
            name="stonefile"
          />
        </div>
        <div>
          <div className="registertext">name</div>
          <input
            className="stonenameinput"
            type="text"
            placeholder="?????? ????????? ??????????????????."
            onChange={onChangeStoneName}
          ></input>
        </div>
        <div>
          <div className="registertext">lyricist</div>
          <input
            className="stonenameinput"
            type="text"
            placeholder="?????? ???????????? ??????????????????."
            onChange={onChangeLyricist}
          ></input>
        </div>
        <div>
          <div className="registertext">composer</div>
          <input
            className="stonenameinput"
            type="text"
            placeholder="?????? ???????????? ??????????????????."
            onChange={onChangeComposer}
          ></input>
        </div>
        <div>
          <div className="registertext">info</div>
          <textarea
            className="stoneinfoinput"
            type="text"
            placeholder="????????? ???????????? ??????????????????."
            onChange={onChangeDescription}
          ></textarea>
          <div>
            <div className="registertext">lyrics</div>
            <textarea
              className="lyricsinput"
              type="text"
              placeholder="????????? ????????? ??????????????????."
              onChange={onChangeLyrics}
            ></textarea>
          </div>
          <div>
            <div className="registertext">Category</div>
            <div className="selectbox">
              <select
                className="selectbox"
                onChange={(e) => {
                  const selectedCategory = e.target.value;
                  setCategory(selectedCategory);
                }}
              >
                <option key="default" value="default">
                  ????????? ??????????????? ??????????????????.
                </option>
                <option key="Ballade" value="Ballade">
                  Ballade
                </option>
                <option key="Dance" value="Dance">
                  Dance
                </option>
                <option key="RnB" value="RnB">
                  R&B
                </option>
                <option key="Hiphop" value="Hiphop">
                  Hiphop
                </option>
                <option key="Indie" value="Indie">
                  Indie
                </option>
                <option key="Rock" value="Rock">
                  Rock
                </option>
                <option key="Trot" value="Trot">
                  Trot
                </option>
                <option key="Classic" value="Classic">
                  Classic
                </option>
                <option key="Jazz" value="Jazz">
                  Jazz
                </option>
              </select>
            </div>
          </div>
          <div className="registertext">SFT Minting</div>
          <input
            className="stonenameinput"
            placeholder="????????? SFT ????????? ??????????????????."
            onChange={onChangeSFTAmount}
          ></input>
          <div>
            <button className="editbtn" onClick={mintSFT}>
              ??????
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
