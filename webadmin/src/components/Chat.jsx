import React, { useState, useEffect, useRef } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import './Chat.css';
import '../public/css/bootstrap.min.css'
import '../public/css/fontawesome.min.css'
import '../public/css/templatemo-style.css'
import '../public/js/bootstrap.js'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js/auto';
import { Line, Bar } from 'react-chartjs-2';

import { useToast } from 'rc-toastr'

function Chat(props) {
    console.log(props);
    const host = "http://localhost:3000";
    const [Contextid, setCId] = useState('');
    const [userid, setUserId] = useState("");
    const [userlist, setUserList] = useState();
    const [da, setData] = useState();
    const [daMes, setDataMes] = useState({});
    const [message, setMessage] = useState();
    const socketRef = useRef();
    const [isHome, setHome] = useState(true);
    const [isChat, setChat] = useState(false);
    const [isAc, setAc] = useState(false);
    const [inputmess, setInputMess] = useState('');
    const [search, setSearch] = useState('');
    const [isActive, setActive] = useState();
    const [no, setNo] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [year, setYear] = useState(2023);
    const [newpass, setNewPass] = useState('');
    const [repass, setRepass] = useState('');
    const [luser, setLUser] = useState();
    const [isAccount, setIsAccount] = useState('');
    const { toast } = useToast()
    const [addemail, setaddEmail] = useState('');
    const [addphone, setaddPhone] = useState('');
    const [addname, setaddName] = useState('');
    const [addpass, setaddPass] = useState('');
    const [addrepass, setaddRepass] = useState('');
    useEffect(() => {
        socketRef.current = socketIOClient.connect(host)
        socketRef.current.emit('admin-get-context', props.idadmin);
        socketRef.current.on('admin_data_context', data => {
            if (data.status == "true") {
                setData(data.data);
                console.log(da);

            }
        });
        socketRef.current.on('admin_data_message', data => {
            if (data.status == "true") {
                setMessage(data.data);
            }

        });
        socketRef.current.on('admin_user_new_context', data => {
            socketRef.current.emit('admin-get-context', props.idadmin);
        })
        socketRef.current.on('admin-user-new-message', async dataa => {
            socketRef.current.emit('admin-get-context', props.idadmin);
            if (dataa.contextid == Contextid)
                socketRef.current.emit('admin-get-message-new', dataa.contextid.toString());
        });
        socketRef.current.on('admin_data_message_new', data => {
            if (data.status == "true") {
                setMessage(data.data);
            }
        });
        socketRef.current.on('admin_data_user', data => {
            console.log(data.data);
            setUserList(data.data);
            if (luser == undefined)
                setLUser(data.data);
        });
        return () => {
            socketRef.current.disconnect();
        };
    }, [Contextid]);

    const logout = async () => {
        localStorage.setItem('username', 'false');
        window.location.reload();
    }

    const isContentHome = () => {
        setHome(true);
        setAc(false);
        setChat(false);
    }
    const isContentChat = () => {
        setHome(false);
        setAc(false);
        setChat(true);
    }
    const isContentAc = () => {
        setHome(false);
        setAc(true);
        setChat(false);
    }

    const MONTHS = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    const labels = months({ count: 12 }, MONTHS);
    const optionsLine = {
        scales: {
            yAxes: [
                {
                    scaleLabel: {
                        display: true,
                        labelString: "Hits"
                    },
                    color: 'white',
                    grid: {
                        drawBorder: true,
                        color: '#FFFFFF',
                    },
                    ticks: {
                        beginAtZero: true,
                        color: 'white',
                        fontSize: 12,
                    }
                }
            ]
        },
        maintainAspectRatio: false,
        color: [
            'white',    // color for data at index 0
        ],
    };
    const dtline = dataline(userlist, year)
    const configLine = {
        type: "line",

        labels: labels,
        datasets: [
            {
                label: "Latest Hits",
                data: dtline,
                fill: false,
                borderColor: "rgb(252,252,252)",
                cubicInterpolationMode: "monotone",
                pointRadius: 0
            }
        ],
        options: optionsLine
    };

    const optionsBar = {
        responsive: true,
        scales: {
            yAxes: [
                {
                    barPercentage: 0.2,
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Hits"
                    }
                }
            ]
        }
    };



    const labelsBar = [
        '#F7604D',
        '#4ED6B8',
        '#A8D582',
        '#D7D768',
        '#9D66CC',
        '#DB9C3F',
        '#3889FC'
    ]

    const configBar = {
        type: "horizontalBar",

        labels: ["Red", "Aqua", "Green", "Yellow", "Purple", "Orange", "Blue"],
        datasets: [
            {
                label: "# of Hits",
                data: [33, 40, 28, 49, 58, 38, 44],
                backgroundColor: [
                    "#F7604D",
                    "#4ED6B8",
                    "#A8D582",
                    "#D7D768",
                    "#9D66CC",
                    "#DB9C3F",
                    "#3889FC"
                ],
                borderWidth: 0
            }
        ],
        options: optionsBar
    };

    const Clear = () => {
        setaddName(''); setaddPhone(''); setaddEmail(''); setaddPass(''); setaddRepass('');
    }

    const UpdateUser = () => {
        if (no == "" || no == undefined) {
            toast.error("Please select an account")
        }
        else {
            if (name == '' || email == '' || phone == '') {
                toast.warning('Please fill in all fields')
            }
            else {
                socketRef.current.emit('admin_update_user', userid, name, email, phone)
                toast.success("Updated account successfully");
                setIsAccount('');
            }
        }
    }

    const AddUser = () => {
        if (addname == '' || addemail == '' || addphone == '' || addpass == '' || addrepass == '') {
            toast.warning('Please fill in all fields')
        } else {
            if (addpass != addrepass) {
                toast.error('The passwords are not the same')
            } else {
                socketRef.current.emit('admin_add_user', addname, addemail, addphone, addpass)
                toast.success('Added account successfully')
                setIsAccount('')
                Clear();
            }
        }
    }
    const DeleteUser = () => {
        socketRef.current.emit('admin_delete_user', userid)
        toast.success('Deleted account successfully');
        setIsAccount('');
        setName(''); setNo(''); setPhone(''); setEmail(''); setUserId('');
    }
    const sentMess = () => {
        if (inputmess != '' && daMes != null) {
            const timeElapsed = Date.now();
            const today = new Date(timeElapsed);
            socketRef.current.emit('admin-sent-message', daMes._id, props.idadmin, inputmess, today.toISOString())
            setInputMess('');
        }
    }
    const searchUser = (dt, value) => {
        setSearch(value)
        if (value != "" && value != undefined && value != null && value != " ") {
            value = value.toString()
            var data = [];
            for (let i = 0; i < dt.length; i++) {
                let dtt = dt[i]
                if (value == dtt.name || value == dtt.mail || value == dtt.phone)
                    data.push(dtt);
            }
            setLUser(data);
            console.log(luser)
        } else {
            setLUser(userlist);
            console.log(luser)
        }
    }
    const renderUser = userlist ? (
        userlist.map((data, i) =>
            <tr onClick={() => {
                setName(data.name); setNo(data.stt); setPhone(data.phone); setEmail(data.mail); setUserId(data._id);
                setActive(i);
            }} style={
                isActive === i
                    ? { background: 'green' }
                    : undefined
            }>
                <td><b>{data.stt}</b></td>
                <td><b>{data.name}</b></td>
                <td><b>{data.phone}</b></td>
                <td><b>{data.mail}</b></td>
                <td><b>{data.date}</b></td>
            </tr>
        )) : (<tr>
            <td><b>0001</b></td>
            <td><b>User</b></td>
            <td><b>012345678</b></td>
            <td><b>user1@gmail.com</b></td>
            <td>08:00, 18 NOV 2022</td>
        </tr>)

    const renderContext = da ? (da.map((data) =>
        <div>
            {isNull(data) ? (
                <button className="button1" key={data._id} onClick={async () => {
                    var a = await data
                    setDataMes(a);
                    setCId(data._id);
                    await socketRef.current.emit('admin-get-message', data._id)
                }}><div className="chat-username">{data.username}</div> <br></br><div className="chat-content">{data.content}</div>
                    <br></br><div className="chat-timestamp">{data.timestamp}</div></button>) : undefined}
        </div>
    )) : (<tbody>
        <tr class="table-primary">
            <td className="tm-product-name">Product Category 1</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 2</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 1</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 1</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 2</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 1</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 2</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 1</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
        <tr>
            <td className="tm-product-name">Product Category 2</td>
            <td className="text-center">
                <a href="#" className="tm-product-delete-link">
                    <i className="far fa-trash-alt tm-product-delete-icon" />
                </a>
            </td>
        </tr>
    </tbody>);

    const renderMessage = message ? (message.map((data) =>
        <div>
            {isMessSender(data) ? (<li class="replies">
                <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
                <p>{data.content}</p>

            </li>)
                : (<li class="sent">
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                    <p>{data.content}</p>
                </li>)}
        </div>
    )) : (<ul>
        <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!</p>
        </li>
        <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>When you're backed against the wall, break the god damn thing down.</p>
        </li>
        <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>Excuses don't win championships.</p>
        </li>
        <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>Oh yeah, did Michael Jordan tell you that?</p>
        </li>
        <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>No, I told him that.</p>
        </li>
        <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>What are your choices when someone puts a gun to your head?</p>
        </li>
        <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="" />
            <p>What are you talking about? You do what they say or they shoot you.</p>
        </li>
        <li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
            <p>Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things.</p>
        </li>
    </ul>);


    return (
        <div>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <title>Product Admin - Dashboard HTML Template</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700" />

            <div className id="home">
                <nav className="navbar navbar-expand-xl">
                    <div className="container h-100">
                        <a className="navbar-brand" href="#">
                            <h1 className="tm-site-title mb-0">Admin</h1>
                        </a>
                        <button className="navbar-toggler ml-auto mr-0" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <i className="fas fa-bars tm-nav-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav mx-auto h-100">
                                <li className="nav-item">
                                    <a className="nav-link" href="#" onClick={isContentHome}>
                                        <i className="fas fa-tachometer-alt" />
                                        Dashboard
                                        <span className="sr-only">(current)</span>
                                    </a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="far fa-file-alt" />
                                        <span>
                                            Reports <i className="fas fa-angle-down" />
                                        </span>
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a className="dropdown-item" href="#">Daily Report</a>
                                        <a className="dropdown-item" href="#">Weekly Report</a>
                                        <a className="dropdown-item" href="#">Yearly Report</a>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" onClick={isContentChat}>
                                        <i className="fas fa-comments" />
                                        Chats
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#" onClick={isContentAc}>
                                        <i className="far fa-user" />
                                        Accounts
                                    </a>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className="fas fa-cog" />
                                        <span>
                                            Settings <i className="fas fa-angle-down" />
                                        </span>
                                    </a>
                                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a className="dropdown-item" href="#">Profile</a>
                                        <a className="dropdown-item" href="#">Customize</a>
                                    </div>
                                </li>
                            </ul>
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link d-block" href="#" onClick={logout}>
                                        Admin, <b>Logout</b>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {isHome ? (<div className="container">
                    <div className="row">
                        <div className="col">
                            <p className="text-white mt-2 mb-2">Welcome back, <b>Admin</b></p>
                        </div>
                    </div>
                    {/* row */}
                    <div className="row tm-content-row">
                        <div className="col-sm-24 col-md-24 col-lg-12 col-xl-12 tm-block-col">
                            <div className="tm-bg-primary-dark bg-info tm-block">
                                <div class="form-group row">
                                    <h2 className="tm-block-title">Latest Hits Of The Year &ensp;</h2>

                                    <select class="form-control-sm " value={year} onChange={e => setYear(e.target.value)}>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                    </select>
                                </div>
                                <div className="black"><Line data={configLine} options={optionsLine} /></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 tm-block-col">
                            <div className="tm-bg-primary-dark tm-block">
                                <h2 className="tm-block-title">Performance</h2>
                                <div className="black"><Bar data={configBar} options={optionsBar} /></div>
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 tm-block-col">
                            <div className="tm-bg-primary-dark tm-block tm-block-taller tm-block-overflow">
                                <h2 className="tm-block-title">Notification List</h2>
                                <div className="tm-notification-items">
                                    <div className="media tm-notification-item">
                                        <div className="tm-gray-circle"><img src="img/notification-01.jpg" alt="Avatar Image" className="rounded-circle" /></div>
                                        <div className="media-body">
                                            <p className="mb-2"><b>Admin</b> and <b>6 others</b> sent you new <a href="#" className="tm-notification-link">notification</a>. Check new notification.</p>
                                            <span className="tm-small tm-text-color-secondary">6h ago.</span>
                                        </div>
                                    </div>
                                    <div className="media tm-notification-item">
                                        <div className="tm-gray-circle"><img src="img/notification-01.jpg" alt="Avatar Image" className="rounded-circle" /></div>
                                        <div className="media-body">
                                            <p className="mb-2"><b>Admin</b> and <b>6 others</b> sent you new <a href="#" className="tm-notification-link">notification</a>. Check new notification.</p>
                                            <span className="tm-small tm-text-color-secondary">6h ago.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>) :
                    isChat ? (<div>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <p className="text-white mt-2 mb-2"><a rel="nofollow noopener" href="#" className="tm-footer-link" onClick={isContentHome}>home</a>/<b >chats</b></p>
                                </div>
                            </div>
                            <div className="row tm-content-row">
                                <div className="col-sm-12 col-md-12 col-lg-3 col-xl-3 tm-block-col pr-1">
                                    <div className="tm-bg-primary-dark mt-2 tm-block-product-categories">
                                        <h1 className="tm-block-title pt-4 text-center">Contexts</h1>
                                        <div className="tm-product-table-container p-2">
                                            <table className="table tm-table-small tm-product-table">
                                                <tbody>
                                                    <div>
                                                        {renderContext}
                                                    </div>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pl-0 pr-0">
                                    <div className="tm-bg-primary-dark mt-2 tm-block-product-categories">
                                        <div class="content">
                                            <div class="contact-profile">

                                                {daMes ? (<div><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" />
                                                    <p className="text-dark">{daMes.username}</p></div>) : undefined}
                                                <div class="social-media">
                                                    <i class="fa fa-facebook" aria-hidden="true"></i>
                                                    <i class="fa fa-twitter" aria-hidden="true"></i>
                                                    <i class="fa fa-instagram" aria-hidden="true"></i>

                                                </div>
                                            </div>
                                            <div class="messages">
                                                <ul>
                                                    {renderMessage}
                                                </ul>
                                            </div>
                                            <div class="message-input">
                                                <div class="wrap">
                                                    <input type="text" value={inputmess} onInput={e => setInputMess(e.target.value)} placeholder="Write your message..." />
                                                    <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
                                                    <button class="submit" onClick={sentMess}><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="col-sm-12 col-md-12 col-lg-3 col-xl-3 tm-block-col">
                                    <div className="tm-bg-primary-dark mt-2 tm-block-product-categories">
                                        <h1 className="tm-block-title pt-4 text-center">Profile</h1>
                                        <div className="tm-product-table-container p-2 mh-90">
                                            <p class="text-light text-left p-2">Name: {daMes.username}</p>
                                            <p class="text-light text-left p-2">Email: {daMes.email}</p>
                                            <p class="text-light text-left p-2">Mobile: {daMes.mobile}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>)
                        : (<div>
                            <div className id="home">
                                <div className="container mt-5">
                                    <div className="row tm-content-row">
                                        <div className="col-12 tm-block-col">
                                            <div className="tm-bg-primary-dark tm-block tm-block-h-auto">
                                                <h2 className="tm-block-title">List of Accounts</h2>
                                                <div className="tm-bg-primary-dark tm-block tm-block-taller tm-block-scroll">

                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">NO.</th>
                                                                <th scope="col">NAME</th>
                                                                <th scope="col">MOBILE</th>
                                                                <th scope="col">EMAIL</th>
                                                                <th scope="col">CREATE DAY</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {renderUser}
                                                        </tbody>
                                                    </table>

                                                </div>
                                                <div className="tm-signup-form row">
                                                    <div className="form-group col-lg-4">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-primary btn-block text-uppercase bg-dark" onClick={() => setIsAccount('add')}>
                                                            Add Account
                                                        </button>
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-primary btn-block text-uppercase bg-dark" onClick={() => setIsAccount('update')}>
                                                            Update Account
                                                        </button>
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-primary btn-block text-uppercase bg-dark" onClick={() => setIsAccount('delete')}>
                                                            Delete Account
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isAccount === 'add' ? (<div className="row tm-content-row">
                                        <div className="col-12 tm-block-col">
                                            <div className="tm-bg-primary-dark tm-block tm-block-settings">
                                                <h2 className="tm-block-title">Account Add</h2>
                                                <div className="tm-signup-form row">
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="name">Account Name</label>
                                                        <input id="name" name="name" type="text" className="form-control validate" value={addname} onInput={e => setaddName(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="email">Account Email</label>
                                                        <input id="email" name="email" type="email" className="form-control validate" value={addemail} onInput={e => setaddEmail(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="phone">Account Phone</label>
                                                        <input id="phone" name="phone" type="tel" className="form-control validate" value={addphone} onInput={e => setaddPhone(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="password">Password</label>
                                                        <input id="password" name="password" type="password" className="form-control validate" value={addpass} onInput={e => setaddPass(e.target.value)} />
                                                    </div>

                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="password2">Re-enter Password</label>
                                                        <input id="password2" name="password2" type="password" className="form-control validate " value={addrepass} onInput={e => setaddRepass(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-primary btn-block text-uppercase bg-dark" onClick={Clear}>
                                                            Clear
                                                        </button>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button type="submit" className="btn btn-primary btn-block text-uppercase" onClick={() => setIsAccount('')} >
                                                            cancel
                                                        </button>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-success btn-primary btn-block text-uppercase" onClick={AddUser} >
                                                            Add Account
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>) : (isAccount === 'update' ? (<div className="row tm-content-row">
                                        <div className="col-12 tm-block-col">
                                            <div className="tm-bg-primary-dark tm-block tm-block-settings">
                                                <h2 className="tm-block-title">Account Update</h2>
                                                <div className="tm-signup-form row">
                                                    <div className="form-group col-lg-12">
                                                        <label htmlFor="phone">No.</label>
                                                        <input readOnly id="phone" name="phone" type="tel" className="form-control text-light bg-dark" disabled value={no} />
                                                    </div>

                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="name">Account Name</label>
                                                        <input id="name" name="name" type="text" className="form-control validate" value={name} onInput={e => setName(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="email">Account Email</label>
                                                        <input id="email" name="email" type="email" className="form-control validate" value={email} onInput={e => setEmail(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="phone">Account Phone</label>
                                                        <input id="phone" name="phone" type="tel" className="form-control validate" value={phone} onInput={e => setPhone(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button type="submit" className="btn btn-primary btn-block text-uppercase" onClick={() => setIsAccount('')} >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-success btn-primary btn-block text-uppercase" onClick={UpdateUser}>
                                                            Update Account
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>) : (isAccount === 'delete' ? (<div className="row tm-content-row">
                                        <div className="col-12 tm-block-col">
                                            <div className="tm-bg-primary-dark tm-block tm-block-settings">
                                                <h2 className="tm-block-title">Account Delete</h2>
                                                <p class="text-warning">Are you sure you want to delete this account?</p>
                                                <div className="tm-signup-form row">

                                                    <div className="form-group col-lg-12">
                                                        <label htmlFor="phone">No.</label>
                                                        <input readOnly id="phone" name="phone" type="tel" className="form-control text-light bg-dark" disabled value={no} />
                                                    </div>

                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="name">Account Name</label>
                                                        <input id="name" name="name" type="text" className="form-control validate bg-dark" disabled value={name} onInput={e => setName(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="email">Account Email</label>
                                                        <input id="email" name="email" type="email" className="form-control validate bg-dark" disabled value={email} onInput={e => setEmail(e.target.value)} />
                                                    </div>
                                                    <div className="form-group col-lg-4">
                                                        <label htmlFor="phone">Account Phone</label>
                                                        <input id="phone" name="phone" type="tel" className="form-control validate bg-dark" disabled value={phone} onInput={e => setPhone(e.target.value)} />
                                                    </div>

                                                    <div className="form-group col-lg-6">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button type="submit" className="btn btn-primary btn-block text-uppercase" onClick={() => setIsAccount('')} >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                    <div className="form-group col-lg-6">
                                                        <label className="tm-hide-sm">&nbsp;</label>
                                                        <button className="btn btn-success btn-primary btn-block text-uppercase" onClick={DeleteUser}>
                                                            Delete Account
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>) : undefined))}


                                </div>
                            </div>
                        </div>)
                }
                <footer className="tm-footer row tm-mt-small">
                    <div className="col-12 font-weight-light">
                    </div>
                </footer>
            </div>
        </div >
    )
}

function months(config, MONTHS) {
    var cfg = config || {};
    var count = cfg.count || 12;
    var section = cfg.section;
    var values = [];
    var i, value;

    for (i = 0; i < count; ++i) {
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
    }

    return values;
}

function dataline(data, year) {
    var value = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    if (data == null) return;
    for (let i = 0; i < data.length; i++) {
        let ts = data[i].createday;
        ts = Number(ts);
        let date = new Date(ts);
        let month = date.getMonth();
        let y = date.getFullYear();
        if (y == year)
            value[month]++;
    }
    return value;
}

function isNull(data) {
    if (data != null && data.content != "") return true;
    return false;
}

function isMessSender(data) {
    if (data.senderid == '6374fedad36a12dad2ba4b56') return true;
    return false;
}


export default Chat