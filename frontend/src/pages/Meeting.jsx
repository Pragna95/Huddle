import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { createSocket } from "../services/socket";
import { createPeerConnection } from "../services/webrtc";
import {
    startScreenShare,
    stopScreenShare,
    getScreenSharer,
} from "../api/meeting";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    Share,
    UserPlus,
    MoreVertical,
    Copy,
    PhoneOff,
    Circle,
    LayoutGrid,
    FilePenLine,
    Monitor,
    ChevronDown,
    Search,
    X,
    SendHorizontal,
} from "lucide-react";

const handRaiseMembers = [
    "Rahul",
    "Anika",
    "James",
    "Priya",
    "Michael",
    "Fatima",
    "Kevin",
    "Sofia",
];

const participantMembers = [
    "Rahul",
    "Anika",
    "James",
    "Priya",
    "Michael",
    "Fatima",
    "Kevin",
    "Sofia",
    "John",
    "Emma",
    "David",
    "Sophia",
    "Chris",
    "Olivia",
    "Daniel",
    "Mia",
    "Ethan",
    "Lily",
    "Noah",
    "Ava",
];

const Meeting = () => {
    const socketRef = useRef(null);
    const socketQueueRef = useRef([]);
    const socketReadyRef = useRef(false);

    const peersRef = useRef({});
    const pendingCandidatesRef = useRef({});
    const makingOfferRef = useRef({});

    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const screenStreamRef = useRef(null);

    const remoteStreamRef = useRef(null);
    const screenShareNoticeTimerRef = useRef(null);
    const roomParticipantsRef = useRef([]);

    const displayName = useRef("Andaya").current;

    const userId = useRef(
        typeof crypto !== "undefined" && crypto.randomUUID
            ? `u-${crypto.randomUUID().slice(0, 8)}`
            : `u-${Math.random().toString(36).slice(2, 10)}`
    ).current;

    const meetingId = "meeting_001";
    const meetingLink = meetingId;
    const API_URL = "http://127.0.0.1:8000/api/meetings";

    const [screenSharer, setScreenSharer] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [screenShareNotice, setScreenShareNotice] = useState("");
    const [screenViewers, setScreenViewers] = useState([]);

    const [showHandRaise, setShowHandRaise] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [showParticipantsGrid, setShowParticipantsGrid] = useState(false);
    const [showMenuPage, setShowMenuPage] = useState(false);
    const [activeMenu, setActiveMenu] = useState("assistance");
    const [transcriptionEnabled, setTranscriptionEnabled] = useState(true);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordingStopped, setRecordingStopped] = useState(false);

    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isHandRaised, setIsHandRaised] = useState(false);

    const [message, setMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { sender: "Rahul", text: "Can we start the demo?" },
        { sender: "Anika", text: "Sharing the screen now." },
    ]);

    const [roomParticipants, setRoomParticipants] = useState([
        { userId, name: displayName, isSelf: true },
    ]);

    const [isLoadingState, setIsLoadingState] = useState(true);

    useEffect(() => {
        roomParticipantsRef.current = roomParticipants;
    }, [roomParticipants]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStreamRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
            remoteVideoRef.current.play().catch(() => { });
        }
    }, [screenSharer]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        let interval;

        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRecording]);

    //PARTICIPANT WEBSOCKET


    useEffect(() => {
        console.log("Creating WebSocket...");

        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/participants/${meetingId}/`,
        );

        socket.onopen = () => {
            console.log("WebSocket Connected");
        };

        socket.onmessage = (event) => {
            console.log("Message:", JSON.parse(event.data));
        };

        socket.onerror = (error) => {
            console.log("WebSocket Error:", error);
        };

        socket.onclose = (event) => {
            console.log("WebSocket Closed", event.code, event.reason);
        };

        return () => {
            console.log("Cleaning up WebSocket");
            //socket.close();
        };
    }, []);

    useEffect(() => {
        fetchParticipantState();
    }, []);

    const fetchParticipantState = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/participant/${meetingId}/${userId}/`
            );

            const data = response.data.data;
            if (data) {
                setIsMicOn(data.mic_on);
                setIsVideoOn(data.video_on);
                setIsHandRaised(data.hand_raised);
                console.log("Participant Loaded", data);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("New participant! Initializing local UI with default states.");
                updateParticipantState(true, true, false);
            } else {
                console.error("Failed to fetch participant state:", error);
            }
        } finally {
            setIsLoadingState(false);
        }
    };

    const updateParticipantState = async (mic, video, hand) => {
        if (!meetingId || !userId) return;
        try {
            await axios.post(
                `${API_URL}/participant/update/`,
                {
                    user_id: userId,
                    meeting_id: meetingId,
                    mic_on: mic,
                    video_on: video,
                    hand_raised: hand,
                },
                { validateStatus: (s) => s < 500 }
            );
        } catch (error) {
            console.warn("updateParticipantState failed:", error?.response?.status, error?.message);
        }
    };

    //SCREEN SHARING WEBSOCKET

    const getParticipantNameById = (id) => {
        if (!id) return "Someone";
        const list = roomParticipantsRef.current || [];
        return list.find((p) => String(p.userId) === String(id))?.name || "Someone";
    };

    const getSharerLabel = () => {
        if (!screenSharer) return "";
        return (
            screenSharer.name ||
            getParticipantNameById(screenSharer.user_id) ||
            "Someone"
        );
    };

    const isLocalScreenSharing =
        !!screenStream && String(screenSharer?.user_id) === String(userId);
    const isRemoteScreenSharing =
        !!screenSharer && String(screenSharer.user_id) !== String(userId);
    const isScreenSharing = isLocalScreenSharing || isRemoteScreenSharing;
    const isAnotherUserSharing = isRemoteScreenSharing;

    const showScreenShareNotice = (text) => {
        setScreenShareNotice(text);

        if (screenShareNoticeTimerRef.current) {
            clearTimeout(screenShareNoticeTimerRef.current);
        }

        screenShareNoticeTimerRef.current = setTimeout(() => {
            setScreenShareNotice("");
        }, 3000);
    };

    const flushSocketQueue = (socket) => {
        while (socketQueueRef.current.length > 0) {
            const payload = socketQueueRef.current.shift();
            try {
                socket.send(payload);
            } catch (err) {
                console.log("Queue flush error:", err);
            }
        }
    };

    const safeSend = (data) => {
        const payload = JSON.stringify(data);
        const socket = socketRef.current;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            socketQueueRef.current.push(payload);
            return;
        }

        socket.send(payload);
    };

    const syncRoomParticipants = (incomingList = []) => {
        const cleaned = incomingList
            .filter(Boolean)
            .filter((p) => String(p.userId) !== String(userId));

        setRoomParticipants([{ userId, name: displayName, isSelf: true }, ...cleaned]);

        if (screenSharer) {
            setScreenViewers((prev) => {
                const map = new Map(prev.map((v) => [String(v.userId), v]));
                cleaned.forEach((p) => {
                    if (!map.has(String(p.userId))) {
                        map.set(String(p.userId), { userId: p.userId, name: p.name || p.userId });
                    }
                });
                return Array.from(map.values());
            });
        }
    };

    const addOrUpdateRoomParticipant = (participant) => {
        if (!participant?.userId) return;

        setRoomParticipants((prev) => {
            const without = prev.filter(
                (p) => String(p.userId) !== String(participant.userId) && !p.isSelf
            );

            return [
                { userId, name: displayName, isSelf: true },
                ...without,
                { ...participant, isSelf: false },
            ];
        });

        if (screenSharer) {
            setScreenViewers((prev) => {
                const exists = prev.find((v) => String(v.userId) === String(participant.userId));
                if (exists) return prev;
                return [...prev, { userId: participant.userId, name: participant.name || participant.userId }];
            });
        }
    };

    const removeRoomParticipant = (participantId) => {
        setRoomParticipants((prev) =>
            prev.filter((p) => String(p.userId) !== String(participantId) || p.isSelf)
        );
        setScreenViewers((prev) =>
            prev.filter((v) => String(v.userId) !== String(participantId))
        );
    };

    const closePeer = (remoteUserId) => {
        const peer = peersRef.current[remoteUserId];
        if (!peer) return;

        try {
            peer.close();
        } catch (err) {
            console.log(err);
        }

        delete peersRef.current[remoteUserId];
        delete pendingCandidatesRef.current[remoteUserId];
        delete makingOfferRef.current[remoteUserId];
    };

    const renegotiatePeer = async (peer, remoteUserId) => {
        if (!peer || !remoteUserId) return;
        if (peer.signalingState !== "stable") return;
        if (makingOfferRef.current[remoteUserId]) return;

        try {
            makingOfferRef.current[remoteUserId] = true;

            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            safeSend({
                type: "offer",
                offer: peer.localDescription,
                userId,
                to: remoteUserId,
            });
        } catch (err) {
            console.log("Screen share renegotiation error:", err);
        } finally {
            makingOfferRef.current[remoteUserId] = false;
        }
    };

    const getOrCreatePeer = (remoteUserId) => {
        if (peersRef.current[remoteUserId]) return peersRef.current[remoteUserId];

        pendingCandidatesRef.current[remoteUserId] = [];
        makingOfferRef.current[remoteUserId] = false;

        const peer = createPeerConnection(
            (stream) => {
                if (stream) {
                    remoteStreamRef.current = stream;
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = stream;
                        remoteVideoRef.current.play().catch(() => { });
                    }
                }
            },
            (candidate) => {
                safeSend({
                    type: "ice-candidate",
                    candidate,
                    userId,
                    to: remoteUserId,
                });
            }
        );

        peer.onnegotiationneeded = async () => {
            if (peer.signalingState !== "stable") return;
            if (makingOfferRef.current[remoteUserId]) return;

            try {
                makingOfferRef.current[remoteUserId] = true;
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);

                safeSend({
                    type: "offer",
                    offer: peer.localDescription,
                    userId,
                    to: remoteUserId,
                });
            } catch (err) {
                console.log("Negotiation error:", err);
            } finally {
                makingOfferRef.current[remoteUserId] = false;
            }
        };

        peersRef.current[remoteUserId] = peer;
        return peer;
    };

    const flushPendingCandidates = async (remoteUserId, peer) => {
        const pending = pendingCandidatesRef.current[remoteUserId] || [];
        pendingCandidatesRef.current[remoteUserId] = [];

        for (const candidate of pending) {
            try {
                await peer.addIceCandidate(candidate);
            } catch (err) {
                console.log("Pending ICE error:", err);
            }
        }
    };

    const attachScreenTrackToPeer = async (peer, stream, remoteUserId) => {
        if (!peer || !stream) return;

        let changed = false;

        for (const track of stream.getTracks()) {
            const sender = peer.getSenders().find((s) => s.track?.kind === track.kind);

            if (sender) {
                if (sender.track?.id !== track.id) {
                    try {
                        await sender.replaceTrack(track);
                        changed = true;
                    } catch (err) {
                        console.log("replaceTrack error:", err);
                    }
                }
            } else {
                try {
                    peer.addTrack(track, stream);
                    changed = true;
                } catch (err) {
                    console.log("addTrack error:", err);
                }
            }
        }

        if (changed && remoteUserId) {
            await renegotiatePeer(peer, remoteUserId);
        }
    };

    const handleOffer = async (data) => {
        const remoteUserId = data.userId;
        const peer = getOrCreatePeer(remoteUserId);

        try {
            if (peer.signalingState !== "stable") {
                try {
                    await peer.setLocalDescription({ type: "rollback" });
                } catch (err) {
                    console.log("Rollback skipped:", err);
                }
            }

            await peer.setRemoteDescription(new RTCSessionDescription(data.offer));

            if (peer.signalingState !== "have-remote-offer") {
                return;
            }

            await flushPendingCandidates(remoteUserId, peer);

            const answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);

            safeSend({
                type: "answer",
                answer: peer.localDescription,
                userId,
                to: remoteUserId,
            });
        } catch (err) {
            console.log("Offer handling error:", err);
        }
    };

    const handleAnswer = async (data) => {
        const remoteUserId = data.userId;
        const peer = peersRef.current[remoteUserId];
        if (!peer) return;
        if (peer.signalingState !== "have-local-offer") return;

        try {
            await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
            await flushPendingCandidates(remoteUserId, peer);
        } catch (err) {
            console.log("Answer handling error:", err);
        }
    };

    const handleIce = async (data) => {
        const remoteUserId = data.userId;
        const peer = peersRef.current[remoteUserId] || getOrCreatePeer(remoteUserId);
        const candidate = new RTCIceCandidate(data.candidate);

        try {
            if (peer.remoteDescription) {
                await peer.addIceCandidate(candidate);
            } else {
                if (!pendingCandidatesRef.current[remoteUserId]) {
                    pendingCandidatesRef.current[remoteUserId] = [];
                }
                pendingCandidatesRef.current[remoteUserId].push(candidate);
            }
        } catch (err) {
            console.log("ICE error:", err);
        }
    };

    const handleParticipantJoined = async (participant) => {
        if (!participant?.userId || String(participant.userId) === String(userId)) return;

        addOrUpdateRoomParticipant(participant);

        if (screenStreamRef.current) {
            const peer = getOrCreatePeer(participant.userId);
            await attachScreenTrackToPeer(peer, screenStreamRef.current, participant.userId);
        }

        if (screenSharer && String(screenSharer.user_id) !== String(participant.userId)) {
            setScreenViewers((prev) => {
                const exists = prev.find((v) => String(v.userId) === String(participant.userId));
                if (exists) return prev;
                return [...prev, { userId: participant.userId, name: participant.name || participant.userId }];
            });
        }
    };

    const handleParticipantLeft = (participantId) => {
        if (!participantId) return;
        removeRoomParticipant(participantId);
        closePeer(participantId);

        if (String(screenSharer?.user_id) === String(participantId)) {
            setScreenSharer(null);
            setScreenStream(null);
            setScreenViewers([]);
            remoteStreamRef.current = null;

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
                remoteVideoRef.current.style.display = "block";
            }
        }
    };


    useEffect(() => {
        if (videoRef.current && screenStream && isLocalScreenSharing) {
            videoRef.current.srcObject = screenStream;
            videoRef.current.play().catch(() => { });
        }
    }, [screenStream, isLocalScreenSharing]);

    useEffect(() => {
        let alive = true;

        const fetchCurrentSharer = async () => {
            try {
                const res = await getScreenSharer(meetingLink);
                const ss = res?.data?.screen_share || null;

                if (!alive) return;

                if (ss) {
                    const resolvedName =
                        ss.name || getParticipantNameById(ss.user_id) || "Someone";
                    setScreenSharer({ ...ss, name: resolvedName });
                } else {
                    setScreenSharer(null);
                    setScreenViewers([]);
                }
            } catch (err) {
                const status = err?.response?.status;
                if (alive && status !== 400 && status !== 404) {
                    console.warn("getScreenSharer failed:", status);
                }
            }
        };

        fetchCurrentSharer();
        const interval = setInterval(fetchCurrentSharer, 2000);

        return () => {
            alive = false;
            clearInterval(interval);
        };
    }, [meetingLink]);

    useEffect(() => {
        return () => {
            if (screenShareNoticeTimerRef.current) {
                clearTimeout(screenShareNoticeTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        let socket = null;

        const timer = setTimeout(() => {
            if (cancelled) return;

            socket = createSocket(meetingLink);
            socketRef.current = socket;
            socketReadyRef.current = false;

            socket.onopen = () => {
                if (cancelled) {
                    try {
                        socket.close(1000, "cleanup");
                    } catch (err) {
                        console.log(err);
                    }
                    return;
                }

                socketReadyRef.current = true;
                flushSocketQueue(socket);

                safeSend({
                    type: "join",
                    userId,
                    name: displayName,
                });
            };

            socket.onerror = (e) => {
                console.log("Socket error", e);
            };

            socket.onclose = () => {
                socketReadyRef.current = false;
                if (socketRef.current === socket) {
                    socketRef.current = null;
                }
            };

            socket.onmessage = async (event) => {
                const data = JSON.parse(event.data);

                if (String(data.userId) === String(userId)) return;

                if (data.type === "participants") {
                    syncRoomParticipants(data.participants || []);
                } else if (data.type === "participant-joined") {
                    await handleParticipantJoined(data.participant);
                } else if (data.type === "participant-left") {
                    handleParticipantLeft(data.userId);
                } else if (data.type === "offer") {
                    await handleOffer(data);
                } else if (data.type === "answer") {
                    await handleAnswer(data);
                } else if (data.type === "ice-candidate") {
                    await handleIce(data);
                } else if (data.type === "screen-share-start") {
                    const sharerId = data.screenSharer?.user_id || data.userId;
                    const sharerName =
                        data.screenSharer?.name ||
                        getParticipantNameById(sharerId) ||
                        "Someone";

                    setScreenSharer({
                        user_id: sharerId,
                        name: sharerName,
                    });

                    if (String(sharerId) !== String(userId)) {
                        setScreenViewers((prev) => {
                            const exists = prev.find((p) => String(p.userId) === String(userId));
                            if (exists) return prev;
                            return [...prev, { userId, name: displayName, isSelf: true }];
                        });

                        setRoomParticipants((currentParticipants) => {
                            setScreenViewers((prev) => {
                                const existingIds = new Set(prev.map((v) => String(v.userId)));
                                const others = currentParticipants
                                    .filter((p) => !p.isSelf && !existingIds.has(String(p.userId)));
                                return [...prev, ...others.map((p) => ({ userId: p.userId, name: p.name }))];
                            });
                            return currentParticipants;
                        });

                        setScreenStream(null);
                        remoteStreamRef.current = null;

                        if (remoteVideoRef.current) {
                            remoteVideoRef.current.srcObject = null;
                            remoteVideoRef.current.style.display = "block";
                        }
                    }
                } else if (data.type === "screen-share-stop") {
                    const stoppedUserId = data.userId || data.screenSharer?.user_id;

                    if (stoppedUserId) {
                        setScreenSharer((prev) =>
                            String(prev?.user_id) === String(stoppedUserId) ? null : prev
                        );
                    }

                    if (String(stoppedUserId) === String(userId)) {
                        setScreenStream(null);
                    }

                    remoteStreamRef.current = null;
                    setScreenViewers([]);

                    if (remoteVideoRef.current && stoppedUserId) {
                        remoteVideoRef.current.srcObject = null;
                        remoteVideoRef.current.style.display = "block";
                    }
                }
            };
        }, 250);

        return () => {
            cancelled = true;
            clearTimeout(timer);

            if (socket) {
                socket.onmessage = null;
                socket.onerror = null;

                if (socket.readyState === WebSocket.OPEN) {
                    try {
                        socket.close(1000, "cleanup");
                    } catch (err) {
                        console.log(err);
                    }
                } else if (socket.readyState === WebSocket.CONNECTING) {
                    socket.onopen = () => {
                        try {
                            socket.close(1000, "cleanup");
                        } catch (err) {
                            console.log(err);
                        }
                    };
                }
            }

            socketRef.current = null;
            socketQueueRef.current = [];
            socketReadyRef.current = false;

            Object.keys(peersRef.current).forEach((key) => closePeer(key));
        };
    }, [meetingLink, userId]);

    const handleScreenShare = async () => {
        try {
            if (isAnotherUserSharing) {
                showScreenShareNotice(
                    `${getSharerLabel()} is already sharing the screen. Only one participant can share at a time.`
                );
                return;
            }

            if (screenStreamRef.current) return;

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            screenStreamRef.current = stream;
            setScreenStream(stream);
            setScreenSharer({ user_id: userId, name: displayName });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.style.objectFit = "contain";
                videoRef.current.style.backgroundColor = "#000";
                videoRef.current.play().catch(() => { });
            }

            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
                remoteVideoRef.current.style.display = "none";
            }

            const others = roomParticipantsRef.current.filter(
                (p) => String(p.userId) !== String(userId)
            );

            for (const member of others) {
                const peer = getOrCreatePeer(member.userId);
                await attachScreenTrackToPeer(peer, stream, member.userId);
            }

            setScreenViewers(
                others.map((p) => ({ userId: p.userId, name: p.name }))
            );

            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.onended = () => {
                    stopSharing();
                };
            }

            try {
                await startScreenShare(meetingLink, userId);
                safeSend({
                    type: "screen-share-start",
                    userId,
                    screenSharer: { user_id: userId, name: displayName },
                });
            } catch (err) {
                console.log(err);
            }
        } catch (err) {
            if (err?.name === "NotAllowedError") return;
            console.log(err);
        }
    };

    const stopSharing = async () => {
        const activeStream = screenStreamRef.current;

        if (activeStream) {
            activeStream.getTracks().forEach((t) => t.stop());
        }

        Object.entries(peersRef.current).forEach(([remoteUserId, peer]) => {
            try {
                peer.getSenders().forEach((sender) => {
                    if (sender.track && activeStream) {
                        const isScreenTrack = activeStream
                            .getTracks()
                            .some((t) => t.id === sender.track.id);

                        if (isScreenTrack) {
                            peer.removeTrack(sender);
                        }
                    }
                });

                renegotiatePeer(peer, remoteUserId);
            } catch (err) {
                console.log(err);
            }
        });

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.style.objectFit = "contain";
            videoRef.current.style.backgroundColor = "transparent";
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.style.display = "block";
            remoteVideoRef.current.srcObject = null;
        }

        screenStreamRef.current = null;
        setScreenStream(null);
        setScreenSharer(null);
        setScreenShareNotice("");
        setScreenViewers([]);
        remoteStreamRef.current = null;

        try {
            await stopScreenShare(meetingLink, userId);
        } catch (err) {
            console.log(err);
        }

        safeSend({
            type: "screen-share-stop",
            userId,
        });
    };

    const handleSendMessage = () => {
        if (message.trim() === "") return;

        setChatMessages((prev) => [...prev, { sender: "You", text: message }]);
        setMessage("");
    };





    const InitialsAvatar = ({ name, isSelf = false }) => (
        <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base shrink-0 border-2 ${isSelf ? "bg-indigo-700 border-indigo-400" : "bg-slate-600 border-slate-400"
                }`}
        >
            {(name || "??").slice(0, 2).toUpperCase()}
        </div>
    );

    const ParticipantTile = ({ name, isSelf = false, isMuted = false }) => (
        <div className="relative w-[150px] h-[100px] rounded-2xl overflow-hidden bg-[#1e1f26] border border-white/10 shadow-xl flex items-center justify-center shrink-0">
            <div className="flex flex-col items-center gap-2">
                <InitialsAvatar name={name} isSelf={isSelf} />
                <p className="text-white text-xs font-semibold truncate max-w-[130px] px-2 text-center">
                    {isSelf ? `${name} (You)` : name}
                </p>
            </div>
            {isMuted && (
                <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1">
                    <MicOff size={11} className="text-red-400" />
                </div>
            )}
        </div>
    );

    const screenShareTiles = useMemo(() => {
        const map = new Map();

        map.set(String(userId), { userId, name: displayName, isSelf: true });

        roomParticipants.forEach((p) => {
            if (!p.isSelf) {
                map.set(String(p.userId), { ...p, isSelf: false });
            }
        });

        screenViewers.forEach((v) => {
            if (!map.has(String(v.userId))) {
                map.set(String(v.userId), { userId: v.userId, name: v.name, isSelf: false });
            }
        });

        return Array.from(map.values());
    }, [roomParticipants, screenViewers, userId, displayName]);

    return (
        <div className="h-screen w-screen bg-[#f4f4f5] flex flex-col overflow-hidden font-sans">
            {/* ================= HEADER ================= */}
            <header className="h-[78px] bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                {/* LEFT */}
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-sm">
                        <Monitor size={22} fill="white" />
                    </div>

                    <div className="leading-tight">
                        <h2 className="text-[17px] font-bold text-slate-800">
                            Huddle_Name
                        </h2>
                        <p className="text-[12px] text-slate-400 mt-1">
                            Tuesday, 07-04-2026
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            if (isRecording) {
                                setIsRecording(false);
                                setRecordingStopped(true);

                                setTimeout(() => {
                                    setRecordingStopped(false);
                                    setRecordingTime(0);
                                }, 2000);
                            } else {
                                setRecordingTime(0);
                                setIsRecording(true);
                            }
                        }}
                        className={`ml-5 flex items-center gap-2 px-4 py-2 h-[40px] rounded-[8px] text-[14px] font-semibold border transition-all duration-300 ${isRecording
                            ? "bg-[#D14343] text-white border-[#D14343]"
                            : "bg-white text-[#D14343] border-[#D14343] hover:bg-red-50"
                            }`}
                    >
                        <Circle
                            size={10}
                            fill={
                                isRecording ? "white" : recordingStopped ? "#ef4444" : "#D14343"
                            }
                            color={
                                isRecording ? "white" : recordingStopped ? "#ef4444" : "#D14343"
                            }
                            className={isRecording ? "animate-pulse" : ""}
                        />

                        {isRecording
                            ? `REC ${formatTime(recordingTime)}`
                            : recordingStopped
                                ? "Stop Recording"
                                : "Start Recording"}
                    </button>
                </div>


                {/* RIGHT */}
                <button className="bg-[#D14343] hover:bg-[#a51f1f] transition text-white px-4 h-[40px] rounded-[8px] flex items-center gap-2 text-[16px] font-bold shadow-sm">
                    Leave Huddle
                    <PhoneOff size={18} />
                </button>
            </header>


            {/* ================= BODY ================= */}
            <main className="flex-1 p-4 flex gap-4 min-h-0 overflow-hidden">
                {/* ================= MAIN AREA ================= */}
                <div
                    className={`relative rounded-[28px] overflow-hidden bg-black shadow-sm h-full transition-all duration-300 ${showParticipantsGrid
                        ? "w-full"
                        : showHandRaise || showParticipants || showMenuPage
                            ? "w-[80%]"
                            : "w-full"
                        }`}
                >
                    {screenShareNotice && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-xl z-50 shadow-lg">
                            {screenShareNotice}
                        </div>
                    )}


                    {/* ================= PARTICIPANTS GRID ================= */}
                    {showParticipantsGrid ? (
                        <div className="w-full h-full bg-[#0f172a] p-6 overflow-y-auto">
                            {/* TOP BAR */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-white text-2xl font-bold">
                                    All Participants
                                </h2>

                                <button
                                    onClick={() => setShowParticipantsGrid(false)}
                                    className="bg-white text-slate-700 px-5 py-2 rounded-2xl text-sm font-semibold hover:bg-slate-100 transition"
                                >
                                    Back to Meeting
                                </button>
                            </div>

                            {/* GRID */}
                            <div className="grid grid-cols-4 gap-5">
                                {participantMembers.map((member, index) => (
                                    <div
                                        key={index}
                                        className="relative h-[240px] rounded-[28px] overflow-hidden border border-slate-700 bg-slate-900"
                                    >
                                        <img
                                            src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"
                                                }/${index + 20}.jpg`}
                                            alt={member}
                                            className="w-full h-full object-cover"
                                        />

                                        <div className="absolute inset-0 bg-black/20"></div>

                                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                            <div className="bg-black/40 backdrop-blur-xl px-3 py-1 rounded-xl text-white text-sm font-medium">
                                                {member}
                                            </div>

                                            <div className="bg-black/40 p-2 rounded-full">
                                                <MicOff size={15} className="text-white" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {isScreenSharing ? (
                                <div className="absolute inset-0 bg-[#0e0e10] flex flex-col">
                                    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pt-4 pointer-events-none">
                                        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
                                            <Monitor size={15} className="text-green-400" />
                                            <span>
                                                {isLocalScreenSharing
                                                    ? `${displayName} (You, presenting)`
                                                    : `${getSharerLabel()} is presenting`}
                                            </span>
                                        </div>

                                        {isLocalScreenSharing && (
                                            <button
                                                onClick={stopSharing}
                                                className="pointer-events-auto flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition"
                                            >
                                                <X size={14} /> Stop presenting
                                            </button>
                                        )}
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center pt-14 pb-[118px] px-4">
                                        {isLocalScreenSharing ? (
                                            <video
                                                autoPlay
                                                playsInline
                                                muted
                                                ref={videoRef}
                                                className="w-full h-full object-contain rounded-xl bg-black"
                                            />
                                        ) : (
                                            <video
                                                autoPlay
                                                playsInline
                                                key={screenSharer?.user_id || "remote-share"}
                                                ref={(el) => {
                                                    remoteVideoRef.current = el;
                                                    if (el && remoteStreamRef.current) {
                                                        el.srcObject = remoteStreamRef.current;
                                                        el.play().catch(() => { });
                                                    }
                                                }}
                                                className="w-full h-full object-contain rounded-xl bg-black"
                                            />
                                        )}
                                    </div>

                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-[110px] flex items-center px-5 gap-3 overflow-x-auto z-40"
                                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 70%, transparent)" }}
                                    >
                                        {screenShareTiles.map((tile) => (
                                            <ParticipantTile
                                                key={tile.userId}
                                                name={tile.name}
                                                isSelf={tile.isSelf}
                                                isMuted={tile.isSelf ? !isMicOn : false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* IMAGE */}
                                    <img
                                        src="https://images.unsplash.com/photo-1546961329-78bef0414d7c?q=80&w=1600"
                                        alt="meeting"
                                        className="absolute inset-0 w-full h-full object-cover object-center"
                                    />
                                    <video
                                        ref={remoteVideoRef}
                                        autoPlay
                                        playsInline
                                        className="absolute inset-0 w-full h-full object-contain z-40"
                                    />
                                    <div className="absolute inset-0 bg-black/5"></div>

                                    {/* ================= TOP RIGHT OVERLAYS ================= */}
                                    <div className="absolute top-5 right-5 flex flex-col items-end gap-4 z-40">
                                        {/* PARTICIPANTS OVERLAY */}
                                        <button
                                            onClick={() => {
                                                setShowParticipants(!showParticipants);
                                                setShowHandRaise(false);
                                                setShowMenuPage(false);
                                            }}
                                            className="relative w-[96px] h-[40px]"
                                        >
                                            {/* Avatar 1 */}
                                            <img
                                                src="https://randomuser.me/api/portraits/women/65.jpg"
                                                alt=""
                                                className="absolute left-0 top-0 w-10 h-10 rounded-[12px] border-2 border-white object-cover shadow-md"
                                            />

                                            {/* Avatar 2 */}
                                            <img
                                                src="https://randomuser.me/api/portraits/men/60.jpg"
                                                alt=""
                                                className="absolute left-7 top-0 w-10 h-10 rounded-[12px] border-2 border-white object-cover shadow-md"
                                            />

                                            {/* +3 */}
                                            <div className="absolute left-[56px] top-0 w-10 h-10 rounded-[12px] border-2 border-white bg-[#ACBFFF] flex items-center justify-center shadow-md">
                                                <span className="text-[12px] font-semibold text-[#394C84]">
                                                    +3
                                                </span>
                                            </div>
                                        </button>


                                        {/* HAND RAISE OVERLAY */}
                                        <div className="flex items-end gap-3">
                                            {/* HAND RAISE COUNT */}
                                            <button
                                                onClick={() => {
                                                    setShowHandRaise(!showHandRaise);
                                                    setShowParticipants(false);
                                                    setShowMenuPage(false);
                                                }}
                                                className="bg-white h-[38px] px-4 rounded-[22px] flex items-center justify-center shadow-lg"
                                            >
                                                <span className="text-[22px] font-semibold leading-none text-black">
                                                    ✋ 12
                                                </span>
                                            </button>



                                            {/* AVATAR STACK */}
                                            <div className="relative w-[96px] h-[40px]">
                                                {/* Avatar 1 */}
                                                <img
                                                    src="https://randomuser.me/api/portraits/women/33.jpg"
                                                    alt=""
                                                    className="absolute left-0 top-0 w-10 h-10 rounded-[12px] border-2 border-white object-cover shadow-md"
                                                />

                                                {/* Avatar 2 */}
                                                <img
                                                    src="https://randomuser.me/api/portraits/men/33.jpg"
                                                    alt=""
                                                    className="absolute left-7 top-0 w-10 h-10 rounded-[12px] border-2 border-white object-cover shadow-md"
                                                />


                                                {/* +3 */}
                                                <div className="absolute left-[56px] top-0 w-10 h-10 rounded-[12px] border-2 border-white bg-[#ACBFFF] flex items-center justify-center shadow-md">
                                                    <span className="text-[12px] font-semibold text-[#394C84]">
                                                        +3
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* NAME */}
                                    <h1 className="absolute bottom-7 left-7 text-white text-[38px] font-bold drop-shadow-lg z-20">
                                        Andaya
                                    </h1>


                                    {/* SMALL VIDEO */}
                                    <div className="absolute bottom-5 right-5 w-[220px] h-[140px] rounded-[40px] bg-[#1f1f24] backdrop-blur-2xl border border-white/10 flex items-center justify-center z-20 shadow-2xl">
                                        <div className="text-center">
                                            <div className="w-16 h-16 rounded-full bg-blue-900 text-white flex items-center justify-center mx-auto font-bold text-lg border border-blue-500">
                                                AD
                                            </div>

                                            <p className="text-white text-sm font-semibold mt-3">
                                                Andaya
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>


                {/* ================= SIDEBAR ================= */}
                {(showHandRaise || showParticipants) &&
                    !showParticipantsGrid &&
                    !showMenuPage && (
                        <div className="w-[20%] bg-white rounded-[24px] border border-slate-200 p-4 flex flex-col h-full">
                            {/* TOP */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[17px] font-semibold text-slate-700">
                                    {showHandRaise ? "Hand Raise" : "Participants"}
                                </h2>

                                <button
                                    onClick={() => {
                                        setShowHandRaise(false);
                                        setShowParticipants(false);
                                    }}
                                    className="w-6 h-6 border border-slate-300 rounded flex items-center justify-center text-slate-500"
                                >
                                    ×
                                </button>
                            </div>

                            {/* SEARCH */}
                            <div className="relative mb-4">
                                <Search
                                    size={15}
                                    className="absolute left-3 top-3 text-slate-400"
                                />

                                <input
                                    type="text"
                                    placeholder="search"
                                    className="w-full border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-sm outline-none"
                                />
                            </div>


                            {/* COUNT */}
                            <p className="text-sm text-slate-500 mb-4">
                                {showHandRaise ? "12 Members" : "40 Participants"}
                            </p>

                            {/* MEMBERS */}
                            <div className="space-y-3 overflow-y-auto flex-1">
                                {(showHandRaise
                                    ? handRaiseMembers
                                    : participantMembers.slice(0, 8)
                                ).map((member, index) => (
                                    <div
                                        key={index}
                                        className="border border-slate-300 rounded-xl px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? "men" : "women"
                                                    }/${index + 20}.jpg`}
                                                alt={member}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />

                                            <span className="text-sm font-medium text-slate-700">
                                                {member}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>


                            {/* VIEW ALL PARTICIPANTS */}
                            {!showHandRaise && (
                                <button
                                    onClick={() => setShowParticipantsGrid(true)}
                                    className="mt-5 bg-[#0f172a] text-white py-3 rounded-2xl text-sm font-semibold hover:bg-slate-800 transition"
                                >
                                    View All Participants
                                </button>
                            )}
                        </div>
                    )}



                {/* ================= MENU PAGE ================= */}
                {showMenuPage && (
                    <div className="w-[20%] bg-white rounded-[24px] border border-slate-200 p-4 h-full flex flex-col">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h2 className="text-[18px] font-semibold text-slate-700">
                                Menu
                            </h2>

                            <button
                                onClick={() => setShowMenuPage(false)}
                                className="w-7 h-7 rounded-lg border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* TABS */}
                        <div className="mt-5 bg-[#f3f4f6] rounded-full p-1 flex items-center">
                            <button
                                onClick={() => setActiveMenu("chat")}
                                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeMenu === "chat"
                                    ? "bg-[#0f2a78] text-white"
                                    : "text-slate-500"
                                    }`}
                            >
                                Chat
                            </button>

                            <button
                                onClick={() => setActiveMenu("notes")}
                                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeMenu === "notes"
                                    ? "bg-[#0f2a78] text-white"
                                    : "text-slate-500"
                                    }`}
                            >
                                Notes
                            </button>

                            <button
                                onClick={() => setActiveMenu("assistance")}
                                className={`flex-1 py-2 rounded-full text-sm font-medium transition ${activeMenu === "assistance"
                                    ? "bg-[#0f2a78] text-white"
                                    : "text-slate-500"
                                    }`}
                            >
                                AI
                            </button>
                        </div>

                        {/* CONTENT */}
                        <div className="mt-5 flex-1 overflow-hidden flex flex-col">
                            {/* CHAT */}
                            {activeMenu === "chat" && (
                                <div className="flex flex-col h-full">
                                    <div className="flex-1 overflow-y-auto space-y-4">
                                        {chatMessages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${msg.sender === "You"
                                                        ? "bg-[#0f2a78] text-white"
                                                        : "bg-slate-100 text-slate-700"
                                                        }`}
                                                >
                                                    <p className="text-xs font-semibold mb-1">
                                                        {msg.sender}
                                                    </p>

                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>



                                    {/* INPUT */}
                                    <div className="mt-4 flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 border border-slate-300 rounded-2xl px-4 py-3 text-sm outline-none"
                                        />

                                        <button
                                            onClick={handleSendMessage}
                                            className="w-12 h-12 rounded-2xl bg-[#0f2a78] text-white flex items-center justify-center"
                                        >
                                            <SendHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}


                            {/* NOTES */}
                            {activeMenu === "notes" && (
                                <textarea
                                    placeholder="Write meeting notes..."
                                    className="w-full h-full border border-slate-300 rounded-2xl p-4 outline-none resize-none"
                                ></textarea>
                            )}



                            {/* AI */}
                            {activeMenu === "assistance" && (
                                <div className="flex flex-col gap-4">
                                    <div className="bg-slate-100 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-700">
                                                AI Transcription
                                            </p>

                                            <p className="text-sm text-slate-500 mt-1">
                                                Live captions enabled
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setTranscriptionEnabled(!transcriptionEnabled)
                                            }
                                            className={`w-14 h-7 rounded-full flex items-center px-1 transition ${transcriptionEnabled
                                                ? "bg-[#0f2a78]"
                                                : "bg-slate-300"
                                                }`}
                                        >
                                            <div
                                                className={`w-5 h-5 rounded-full bg-white transition ${transcriptionEnabled ? "translate-x-7" : ""
                                                    }`}
                                            ></div>
                                        </button>
                                    </div>


                                    {/* LIVE TRANSCRIPTION */}
                                    {transcriptionEnabled && (
                                        <div className="space-y-3">
                                            <div className="bg-slate-100 rounded-2xl p-4">
                                                <p className="text-xs font-semibold text-blue-700 mb-1">
                                                    LIVE
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    Rahul: Let's begin the sprint review meeting.
                                                </p>
                                            </div>

                                            <div className="bg-slate-100 rounded-2xl p-4">
                                                <p className="text-xs font-semibold text-blue-700 mb-1">
                                                    LIVE
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    Anika: Sharing the analytics dashboard now.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>


            {/* ================= FOOTER ================= */}
            <footer className="h-[95px] bg-[#f8fafc] border-t border-slate-200 flex items-center justify-between px-6 shrink-0">
                {/* LEFT */}
                <div className="flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-wide font-semibold text-slate-400">
                        Meet ID
                    </span>

                    <div className="bg-slate-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-sm">
                        NFT-rdtve9
                        <Copy size={14} />
                    </div>
                </div>

                {/* CENTER */}
                <div className="bg-white px-5 py-3 rounded-[24px] shadow-md flex items-center gap-3 border border-slate-100">
                    {/* MIC */}
                    <div className="flex items-center bg-slate-50 rounded-xl px-1">
                        <button
                            onClick={() => {
                                const newMicState = !isMicOn;
                                setIsMicOn(newMicState);
                                updateParticipantState(newMicState, isVideoOn, isHandRaised);
                            }}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${isMicOn
                                ? "text-slate-600 hover:bg-slate-100"
                                : "text-red-500 hover:bg-slate-100"
                                }`}
                        >
                            {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
                        </button>

                        <ChevronDown size={15} className="text-slate-400 mr-2" />
                    </div>


                    {/* VIDEO */}
                    <div className="flex items-center bg-slate-50 rounded-xl px-1">
                        <button
                            onClick={() => {
                                const newVideoState = !isVideoOn;
                                setIsVideoOn(newVideoState);
                                updateParticipantState(isMicOn, newVideoState, isHandRaised);
                            }}
                            className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${isVideoOn
                                ? "text-slate-600 hover:bg-slate-100"
                                : "text-red-500 hover:bg-slate-100"
                                }`}
                        >
                            {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
                        </button>

                        <ChevronDown size={15} className="text-slate-400 mr-2" />
                    </div>


                    {/* SHARE */}
                    <button
                        onClick={() => {
                            if (isAnotherUserSharing) {
                                showScreenShareNotice(`${getSharerLabel()} is already sharing the screen. Only one participant can share at a time.`);
                                return;
                            }
                            isLocalScreenSharing ? stopSharing() : handleScreenShare();
                        }}
                        disabled={isAnotherUserSharing && !isLocalScreenSharing}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${isAnotherUserSharing && !isLocalScreenSharing ? "bg-slate-300 text-slate-500 cursor-not-allowed" : isLocalScreenSharing ? " text-red-500" : "text-slate-600 hover:bg-slate-100"}`}
                        title={isAnotherUserSharing ? `${getSharerLabel()} is already sharing` : "Share screen"}
                    >
                        <Share size={18} />
                    </button>

                    <div className="w-px h-7 bg-slate-200"></div>


                    {/* HAND */}
                    <button
                        onClick={() => {
                            const newHand = !isHandRaised;
                            setIsHandRaised(newHand);
                            updateParticipantState(isMicOn, isVideoOn, newHand);
                        }}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${isHandRaised ? "bg-yellow-400 text-black hover:bg-yellow-500" : "bg-white hover:bg-slate-100"}`}
                    >
                        <span className="text-[20px]">🤚</span>
                    </button>

                    {/* USER PLUS */}
                    <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
                        <UserPlus size={18} />
                    </button>

                    {/* MORE */}
                    <button className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition">
                        <MoreVertical size={18} />
                    </button>
                </div>



                {/* RIGHT */}
                <div className="flex items-center gap-3">
                    <button className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-sm">
                        <FilePenLine size={18} />
                    </button>



                    {/* MENU */}
                    <button
                        onClick={() => {
                            setShowMenuPage(!showMenuPage);
                            setShowParticipants(false);
                            setShowHandRaise(false);
                        }}
                        className="w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-sm"
                    >
                        <LayoutGrid size={18} />
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default Meeting;