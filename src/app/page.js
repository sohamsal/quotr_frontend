"use client";
import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import { OpenAI } from "openai";

function App() {
  const [prompt, setPrompt] = useState("");
  const [status1, setStatus1] = useState("bg-danger");
  const [status2, setStatus2] = useState("bg-danger");
  const [status3, setStatus3] = useState("bg-danger");
  const [hidden1, setHidden1] = useState("d-none");
  const [hidden2, setHidden2] = useState("d-none");
  const [hidden3, setHidden3] = useState("d-none");
  const [responseData, setResponseData] = useState(null);
  const [zipCode, setZipCode] = useState("");
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([
    [
      'Ann Arbor Regent Event Space',
      '2525 Carpenter Rd, Ann Arbor, MI 48108, United States',
      '12486334097'
    ],
    [
      'The Ark',
      '316 S Main St, Ann Arbor, MI 48104, United States',
      '12486334097'
    ],
    [
      'Michigan Union',
      '530 S State St, Ann Arbor, MI 48109, United States',
      '12486334097'
    ]
  ]);

  const place1 = async (generatedQuestion, number) => {
    setStatus1("bg-success");
    setHidden1("d-block");
    handleSubmit(generatedQuestion, number);
  };

  const place2 = async (generatedQuestion, number) => {
    setStatus2("bg-success");
    setHidden2("d-block");
    //handleSubmit(generatedQuestion, number);
  };

  const place3 = async (generatedQuestion, number) => {
    setStatus3("bg-success");
    setHidden3("d-block");
    //handleSubmit(generatedQuestion, number);
  };

  // let location = [
  //   [
  //     "Ann Arbor Regent Event Space",
  //     "2525 Carpenter Rd, Ann Arbor, MI 48108, United States",
  //     "12486334097",
  //   ],
  //   [
  //     "The Ark",
  //     "316 S Main St, Ann Arbor, MI 48104, United States",
  //     "12486334097",
  //   ],
  //   [
  //     "Michigan Union",
  //     "530 S State St, Ann Arbor, MI 48109, United States",
  //     "12486334097",
  //   ],
  // ];

  const handleButtonClick = async () => {
    const zipCodeValue = document.getElementById("loco").value;
    const queryValue = document.getElementById("query").value;
    setZipCode(zipCodeValue);
    setQuery(queryValue);
    handleKeyPress();
    console.log("clicked");
    
    try {
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zipCode: zipCodeValue,
          query: queryValue,
        }),
      });
      const data = await response.json();
      setResponseData(data);
      // location.push([data[0].name, data[0].address, data[0].phoneNumber]);
      // location.push([data[1].name, data[1].address, data[1].phoneNumber]);
      // location.push([data[2].name, data[2].address, data[2].phoneNumber]);
      const newLocations = data.map(item => [item.name, item.address, "12486334097"]);
      setLocations(newLocations);
      //console.log(data)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const generateQuestionAndSubmit = async () => {
    try {
      console.log("Prompt:", prompt);
      const generatedQuestion = await generateQuestion(prompt);

      await place1(generatedQuestion, locations[0][2]);
      await delay(3000);
      await place2(generatedQuestion, locations[1][2]);
      await delay(3000);
      await place3(generatedQuestion, locations[2][2]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateQuestion = async (prompt) => {
    const apiKey = "sk-proj-dpMraC8iKy5wGOlJNZTCT3BlbkFJPDcxIbDZqKgRuFJMF3Gr";
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
    let generatedQuestion = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content:
            "Can you turn this into a question a person would ask a business to get a quote for the given service: " +
            prompt,
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      generatedQuestion += chunk.choices[0]?.delta?.content || "";
    }

    console.log("Generated Question:", generatedQuestion);
    return generatedQuestion;
  };

  const handleSubmit = async (generatedQuestion, number) => {
    const axiosapiKey = "s9uykKoI3w153VCTnmbdePCKwfl5sH";
    const endpointUrl =
      "https://studio-api-us.ai.vonage.com/telephony/make-call";

    const callData = {
      agent_id: "6619ee0f4be7aad2b69d02be",
      to: number,
      hangup_on_answer_machine: false,
      session_parameters: [
        { name: "QUESTION", value: generatedQuestion },
        { name: "PROMPT", value: prompt },
      ],
    };

    const headers = {
      "X-Vgai-Key": axiosapiKey,
      "Content-Type": "application/json",
    };

    try {
      const corsProxyUrl = "https://corsproxy.io/?";
      const response = await axios.post(corsProxyUrl + endpointUrl, callData, {
        headers,
      });
      console.log("Call triggered successfully:", response.data);
    } catch (error) {
      console.error("Error making call:", error);
    }
  };

  const handleKeyPress = (event) => {
    console.log("yoooooooooooo");
    //if (event.key === "Enter") {
      generateQuestionAndSubmit();
    //}
  };

  return (
    <div className="App text-light bg-white h-screen">
      <nav
        className="navbar navbar-dark bg-white shadow-sm"
        style={{ height: "90px" }}
      >
        <h2 className="m-4 text-danger">Quotr</h2>
      </nav>
      <div className="col-3 bg-black"></div>
      <div className="container mt-4 px-3 align-center col-6">
        <div className="row">
          <div className="">
            <textarea
              rows="1"
              style={{ backgroundColor: "", fontSize: "1.3vw" }}
              size="4"
              type="text"
              className="p-3 form-control text-dark border-0 shadow"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              //{onKeyPress={handleKeyPress}}
              placeholder="Enter your question here..."
            ></textarea>
          </div>
        </div>

        <div className="flex flex-col justify-center align-items-center">
          <div className="flex flex-row mt-4 mx-4 justify-center align-items-center">
            <div className="col-4">
              <input
                type="text"
                id="loco"
                className="form-control"
                placeholder="Enter zip code or city"
              />
            </div>
            <div className="col-4 mx-2">
              <input
                type="text"
                id="query"
                className="form-control"
                placeholder="Enter location types"
              />
            </div>
            <div className="">
              <button className="btn btn-primary" onClick={handleButtonClick}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center mt-4">
          <div className={`mx-1 p-1 col-3 btn status1 text-light ${status1}`}>
            #1{" "}
          </div>
          <div className={`mx-1 p-1 col-3 btn status1 text-light ${status2}`}>
            #2{" "}
          </div>
          <div className={`mx-1 p-1 col-3 btn status1 text-light ${status3}`}>
            #3{" "}
          </div>
        </div>

        <div
          className={`row mt-3 m-4 p-4 shadow-md text-dark text-start rounded ${hidden1}`}
        >
          <div className="row">
            <img
              className="col-3 rounded"
              src="https://lh3.googleusercontent.com/p/AF1QipMMDv0DeNvcHonbT1kzsk1cdcJKpBM6pBgMPT-n=s1360-w1360-h1020"
              alt="location 1"
            ></img>
            <div className="col-9">
              <h4>{locations[0][0]}</h4>
              <p>
                <b>Quote:</b> $<br></br>
                {locations[0][1]}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`row mt-3 m-4 p-4 shadow-md text-dark text-start rounded ${hidden2}`}
        >
          <div className="row">
            <img
              className="col-3 rounded"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0a/The_Ark_folk_music_venue_Ann_Arbor.JPG"
              alt="location 2"
            ></img>
            <div className="col-9">
              <h4>{locations[1][0]}</h4>
              <p>
                <b>Quote:</b> $<br></br>
                {locations[1][1]}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`row mt-3 m-4 p-4 shadow-md text-dark text-start rounded ${hidden3}`}
        >
          <div className="row">
            <img
              className="col-3 rounded"
              src="https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/annarbor/UnionBldg16-036--78a62dcc5056a36_78a63236-5056-a36a-06d304f7206dcfb8.jpg"
              alt="location 3"
            ></img>
            <div className="col-9">
              <h4>{locations[2][0]}</h4>
              <p>
                <b>Quote:</b> $<br></br>
                {locations[2][1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
