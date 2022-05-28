import React, { useState, useEffect, useContext } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
// import { filterStatus } from "../pre-built/user-manage/UserData";
import {
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  UncontrolledDropdown,
  Modal,
  ModalBody,
  DropdownItem,
  Form,
} from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  Button,
  RSelect,
  TooltipComponent,
} from "../../components/Component";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserContext } from "../pre-built/user-manage/UserContext";
import { bulkActionOptions } from "../../utils/Utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../utils/Constant";
import DatePicker from "react-datepicker";

const UserList = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = contextData;

  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
      first_name: "",
      last_name : "",
      email: "",
      dob: "",
      pan_card : "",
      phone: "",
      status: "Active",
      confirmedStatus : "Confirmed",
      edit_first_name: "",
      edit_last_name : "",
      edit_email: "",
      edit_dob: "",
      edit_pan_card : "",
      edit_phone: "",
      edit_status: "Active",
      edit_confirmedStatus : "Confirmed",
      password : "",
      edit_password : ""
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false);

  const filterStatus = [
    { value: "Confirmed", label: "Confirmed" },
    { value: "NotConfirmed", label: "Not Confirmed" },
  ];

  const filterStatus2 = [
    { value: "Active", label: "Active" },
    { value: "InActive", label: "In Active" },
  ];

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    // let newData;
    // newData = userData.map((item) => {
    //   item.checked = false;
    //   return item;
    // });
    // setData([...newData]);
    loadUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserData = async() => {
    setLoading(true);
    const res = await fetch(BASE_URL + 'user',{
      method : "get",
      headers : {
          "Content-Type" : "application/json",
          'Authorization': 'Bearer ' + accessToken,
      }
   });
   const response = await res.json();
   if(response.status)
   {
    setLoading(false);
    toast.success(response.message,{
      position: toast.POSITION.RIGHT_TOP,
      autoClose:3000
    });
    const data = response.data.map((item) => {
      item.checked = false;
      return item
    })
    setData([...data]);
   }
   else{
    setLoading(false);
    toast.error(response.message,{
      position: toast.POSITION.RIGHT_TOP,
      autoClose:3000
    });
   }
  }
  // Changing state value when searching name
  // useEffect(() => {
  //   if (onSearchText !== "") {
  //     const filteredObject = userData.filter((item) => {
  //       return (
  //         item.name.toLowerCase().includes(onSearchText.toLowerCase()) ||
  //         item.email.toLowerCase().includes(onSearchText.toLowerCase())
  //       );
  //     });
  //     setData([...filteredObject]);
  //   } else {
  //     setData([...userData]);
  //   }
  // }, [onSearchText, setData]);

  // onChange function for searching name
  const onFilterChange = (e) => {
    setSearchText(e.target.value);
  };

  // function to change the selected property of an item
  const onSelectChange = (e, id) => {
    let newData = data;
    let index = newData.findIndex((item) => item._id === id);
    newData[index].checked = e.currentTarget.checked;
    setData([...newData]);
  };

  // function to set the action to be taken in table header
  const onActionText = (e) => {
    setActionText(e.value);
  };

  const searchData = (keyword) => {
    let value = keyword.toLowerCase();
    let result = [];
    result = data.filter((item) => {
         return item.firstName.search(value) != -1;
    })
    setData([...result])
  }

  // function to reset the form
  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name : "",
      email: "",
      dob: "",
      pan_card : "",
      phone: "",
      status: "Active",
      confirmedStatus : "Confirmed",
      edit_first_name: "",
      edit_last_name : "",
      edit_email: "",
      edit_dob: "",
      edit_pan_card : "",
      edit_phone: "",
      edit_status: "Active",
      edit_confirmedStatus : "Confirmed",
      password : "",
      edit_password : ""
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async(submitData) => {
    const { first_name, last_name , email, pan_card, phone, password } = submitData;
    const {confirmedStatus,status, dob} = formData;
    let submittedData = {
      firstName : first_name,
      lastName : last_name,
      email : email,
      mobileNumber : phone,
      password : password,
      isConfirmed : confirmedStatus === 'Confirmed' ? true : false,
      status : status === 'Active' ? true : false,
      dob : dob,
      pancard : pan_card
    };

    try{
    const res = await fetch(BASE_URL + `user`,{
        method : "post",
        headers : {
            "Content-Type" : "application/json",
            'Authorization': 'Bearer ' + accessToken,
        },
        body : JSON.stringify(submittedData)
     });
     const response = await res.json();
     if(response.status)
     {
      toast.success(response.message,{
        position: toast.POSITION.RIGHT_TOP,
        autoClose:3000
      });
      setModal({ add: false });
      loadUserData();
     }
     else{
      toast.error(response.message,{
        position: toast.POSITION.RIGHT_TOP,
        autoClose:3000
      });
     }
    }
    catch(err){
        console.log(err)
    }

    resetForm();
    setModal({ edit: false }, { add: false });
  };

  // submit function to update a new item
  const onEditSubmit = async(submitData) => {
    // let index = newitems.findIndex((item) => item.id === editId);
    // newitems[index] = submittedData;
    
    const { edit_first_name, edit_last_name , edit_email, edit_phone, edit_password } = submitData;
    const {edit_confirmedStatus,edit_status, edit_dob,edit_pan_card} = formData;
    let submittedData = {
      firstName : edit_first_name,
      lastName : edit_last_name,
      email : edit_email,
      mobileNumber : edit_phone,
      password : edit_password,
      isConfirmed : edit_confirmedStatus === 'Confirmed' ? true : false,
      status : edit_status === 'Active' ? true : false,
      dob : edit_dob,
      pancard : edit_pan_card === undefined ? "" : edit_pan_card
    };

    try{
    const res = await fetch(BASE_URL + `user/${editId}`,{
        method : "put",
        headers : {
            "Content-Type" : "application/json",
            'Authorization': 'Bearer ' + accessToken,
        },
        body : JSON.stringify(submittedData)
     });
     const response = await res.json();
     if(response.status)
     {
      toast.success(response.message,{
        position: toast.POSITION.RIGHT_TOP,
        autoClose:3000
      });
      setModal({ add: false });
      loadUserData();
     }
     else{
      toast.error(response.message,{
        position: toast.POSITION.RIGHT_TOP,
        autoClose:3000
      });
     }
    }
    catch(err){
        console.log(err)
    }

    setModal({ edit: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item._id === id) {
        var MyDate = "";
        if(item.dob !== null){
          MyDate = new Date(item.dob);
          MyDate = ('0' + MyDate.getDate()).slice(-2) + '/'
          + ('0' + (MyDate.getMonth()+1)).slice(-2) + '/'
          + MyDate.getFullYear()
        }
       
        setFormData({
          edit_first_name: item.firstName,
          edit_last_name : item.lastName,
          edit_email: item.email,
          edit_status: item.status ? { label : 'Active' , value : 'Active'} : { label : 'InActive' , value : 'InActive'}, 
          edit_confirmedStatus: item.isConfirmed ? { label : 'Confirmed' , value : 'Confirmed'} : { label : 'NotConfirmed' , value : 'NotConfirmed'}, 
          edit_phone: item.mobileNumber,
          edit_pan_card: item.pancard,
          edit_dob : MyDate
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };

  // function to change to suspend property for an item
  const suspendUser = (id) => {
    let newData = data;
    let index = newData.findIndex((item) => item.id === id);
    newData[index].status = "Suspend";
    setData([...newData]);
  };

  // function which fires on applying selected action
  const onActionClick = async(e) => {
    if (actionText === "suspend") {
      let newData = data.map((item) => {
        if (item.checked === true) item.status = "Suspend";
        return item;
      });
      // setData([...newData]);
    } else if (actionText === "delete") {

      var obj = {};
      var arr = [];
      for(var i = 0 ; i < data.length; i++){
        if(data[i].checked){
          arr.push(data[i]._id);
        }
      }

      obj['users'] = arr;
      
      try{
        const res = await fetch(BASE_URL + `user/bulk-delete`,{
            method : "post",
            // mode: 'no-cors',
            headers : {
                "Content-Type" : "application/json",
                'Authorization': 'Bearer ' + accessToken,
            },
            body : JSON.stringify(obj)
            });
            const response = await res.json();
            if(response.status)
            {
            toast.success(response.message,{
            position: toast.POSITION.RIGHT_TOP,
            autoClose:3000
            });
            loadUserData();
            }
            else{
            toast.error(response.message,{
            position: toast.POSITION.RIGHT_TOP,
            autoClose:3000
            });
            }
        }
        catch(err){
            console.log(err)
        }
    }
  };

  // function which selects all the items
  const selectorCheck = (e) => {
    let newData;
    // console.log(data)
    // return;
    newData = data.map((item) => {
      item.checked = e.currentTarget.checked;
      return item;
    });
    setData([...newData]);
  };

  // function to toggle the search option
  const toggle = () => setonSearch(!onSearch);

  const { errors, register, handleSubmit } = useForm();

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="User List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Users Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} users.</p>
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand mr-n1 ${sm ? "active" : ""}`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div className="toggle-expand-content" style={{ display: sm ? "block" : "none" }}>
                  <ul className="nk-block-tools g-3">
                    <li>
                      <a
                        href="#export"
                        onClick={(ev) => {
                          ev.preventDefault();
                        }}
                        className="btn btn-white btn-outline-light"
                      >
                        <Icon name="download-cloud"></Icon>
                        <span>Export</span>
                      </a>
                    </li>
                    <li className="nk-block-tools-opt">
                      <Button color="primary" className="btn-icon" onClick={() => setModal({ add: true })}>
                        <Icon name="plus"></Icon>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <Block>
          <DataTable className="card-stretch">
            <div className="card-inner position-relative card-tools-toggle">
              <div className="card-title-group">
                <div className="card-tools">
                  <div className="form-inline flex-nowrap gx-3">
                    <div className="form-wrap">
                      <RSelect
                        options={bulkActionOptions}
                        className="w-130px"
                        placeholder="Bulk Action"
                        onChange={(e) => onActionText(e)}
                      />
                    </div>
                    <div className="btn-wrap">
                      <span className="d-none d-md-block">
                        <Button
                          disabled={actionText !== "" ? false : true}
                          color="light"
                          outline
                          className="btn-dim"
                          onClick={(e) => onActionClick(e)}
                        >
                          Apply
                        </Button>
                      </span>
                      <span className="d-md-none">
                        <Button
                          color="light"
                          outline
                          disabled={actionText !== "" ? false : true}
                          className="btn-dim  btn-icon"
                          onClick={(e) => onActionClick(e)}
                        >
                          <Icon name="arrow-right"></Icon>
                        </Button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="card-tools mr-n1">
                  <ul className="btn-toolbar gx-1">
                    <li>
                      <a
                        href="#search"
                        onClick={(ev) => {
                          ev.preventDefault();
                          toggle();
                        }}
                        className="btn btn-icon search-toggle toggle-search"
                      >
                        <Icon name="search"></Icon>
                      </a>
                    </li>
                    <li className="btn-toolbar-sep"></li>
                    {/* <li>
                      <div className="toggle-wrap">
                        <Button
                          className={`btn-icon btn-trigger toggle ${tablesm ? "active" : ""}`}
                          onClick={() => updateTableSm(true)}
                        >
                          <Icon name="menu-right"></Icon>
                        </Button>
                        <div className={`toggle-content ${tablesm ? "content-active" : ""}`}>
                          <ul className="btn-toolbar gx-1">
                            <li className="toggle-close">
                              <Button className="btn-icon btn-trigger toggle" onClick={() => updateTableSm(false)}>
                                <Icon name="arrow-left"></Icon>
                              </Button>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <div className="dot dot-primary"></div>
                                  <Icon name="filter-alt"></Icon>
                                </DropdownToggle>
                                <DropdownMenu
                                  right
                                  className="filter-wg dropdown-menu-xl"
                                  style={{ overflow: "visible" }}
                                >
                                  <div className="dropdown-head">
                                    <span className="sub-title dropdown-title">Filter Users</span>
                                    <div className="dropdown">
                                      <DropdownItem
                                        href="#more"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                        className="btn btn-sm btn-icon"
                                      >
                                        <Icon name="more-h"></Icon>
                                      </DropdownItem>
                                    </div>
                                  </div>
                                  <div className="dropdown-body dropdown-body-rg">
                                    <Row className="gx-6 gy-3">
                                      <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            id="hasBalance"
                                          />
                                          <label className="custom-control-label" htmlFor="hasBalance">
                                            {" "}
                                            Have Balance
                                          </label>
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <div className="custom-control custom-control-sm custom-checkbox">
                                          <input
                                            type="checkbox"
                                            className="custom-control-input form-control"
                                            id="hasKYC"
                                          />
                                          <label className="custom-control-label" htmlFor="hasKYC">
                                            {" "}
                                            KYC Verified
                                          </label>
                                        </div>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">Role</label>
                                          <RSelect options={filterRole} placeholder="Any Role" />
                                        </FormGroup>
                                      </Col>
                                      <Col size="6">
                                        <FormGroup>
                                          <label className="overline-title overline-title-alt">Status</label>
                                          <RSelect options={filterStatus} placeholder="Any Status" />
                                        </FormGroup>
                                      </Col>
                                      <Col size="12">
                                        <FormGroup className="form-group">
                                          <Button color="secondary">Filter</Button>
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                  <div className="dropdown-foot between">
                                    <a
                                      href="#reset"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                      className="clickable"
                                    >
                                      Reset Filter
                                    </a>
                                    <a
                                      href="#save"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                      }}
                                    >
                                      Save Filter
                                    </a>
                                  </div>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="btn btn-trigger btn-icon dropdown-toggle">
                                  <Icon name="setting"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right className="dropdown-menu-xs">
                                  <ul className="link-check">
                                    <li>
                                      <span>Show</span>
                                    </li>
                                    <li className={itemPerPage === 10 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(10);
                                        }}
                                      >
                                        10
                                      </DropdownItem>
                                    </li>
                                    <li className={itemPerPage === 15 ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setItemPerPage(15);
                                        }}
                                      >
                                        15
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                  <ul className="link-check">
                                    <li>
                                      <span>Order</span>
                                    </li>
                                    <li className={sort === "dsc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("dsc");
                                          sortFunc("dsc");
                                        }}
                                      >
                                        DESC
                                      </DropdownItem>
                                    </li>
                                    <li className={sort === "asc" ? "active" : ""}>
                                      <DropdownItem
                                        tag="a"
                                        href="#dropdownitem"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          setSortState("asc");
                                          sortFunc("asc");
                                        }}
                                      >
                                        ASC
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className={`card-search search-wrap ${!onSearch && "active"}`}>
                <div className="card-body">
                  <div className="search-content">
                    <Button
                      className="search-back btn-icon toggle-search active"
                      onClick={() => {
                        setSearchText("");
                        toggle();
                      }}
                    >
                      <Icon name="arrow-left"></Icon>
                    </Button>
                    <input
                      type="text"
                      className="border-transparent form-focus-none form-control"
                      placeholder="Search Keyword"
                      value={onSearchText}
                      onChange={(e) => onFilterChange(e)}
                    />
                    <Button className="search-submit btn-icon" onClick={() => searchData(onSearchText)}>
                      <Icon name="search"></Icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DataTableBody compact>
              <DataTableHead>
              <DataTableRow className="nk-tb-col-check">
                  <div className="custom-control custom-control-sm custom-checkbox notext">
                    <input
                      type="checkbox"
                      className="custom-control-input form-control"
                      onChange={(e) => selectorCheck(e)}
                      id="uid"
                    />
                    <label className="custom-control-label" htmlFor="uid"></label>
                  </div>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">_ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">DOB</span>
                </DataTableRow>
                <DataTableRow size="sm">
                  <span className="sub-text">Email</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Phone</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Pan Card</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Verified</span>
                </DataTableRow>
                {/* <DataTableRow size="lg">
                  <span className="sub-text">Last Login</span>
                </DataTableRow> */}
                <DataTableRow>
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-right">
                  <UncontrolledDropdown>
                    <DropdownToggle tag="a" className="btn btn-xs btn-outline-light btn-icon dropdown-toggle">
                      <Icon name="plus"></Icon>
                    </DropdownToggle>
                    <DropdownMenu right className="dropdown-menu-xs">
                      <ul className="link-tidy sm no-bdr">
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="bl" />
                            <label className="custom-control-label" htmlFor="bl">
                              Balance
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="ph" />
                            <label className="custom-control-label" htmlFor="ph">
                              Phone
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="vri" />
                            <label className="custom-control-label" htmlFor="vri">
                              Verified
                            </label>
                          </div>
                        </li>
                        <li>
                          <div className="custom-control custom-control-sm custom-checkbox">
                            <input type="checkbox" className="custom-control-input form-control" id="st" />
                            <label className="custom-control-label" htmlFor="st">
                              Status
                            </label>
                          </div>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </DataTableRow>
              </DataTableHead>
              {/*Head*/}
              {currentItems.length > 0
                ? currentItems.map((item) => {
                    return (
                      <DataTableItem key={item._id}>
                        <DataTableRow className="nk-tb-col-check">
                          <div className="custom-control custom-control-sm custom-checkbox notext">
                            <input
                              type="checkbox"
                              className="custom-control-input form-control"
                              defaultChecked={item.checked}
                              id={item._id + "uid1"}
                              key={Math.random()}
                              onChange={(e) => onSelectChange(e, item._id)}
                            />
                            <label className="custom-control-label" htmlFor={item._id + "uid1"}></label>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item._id}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item._id}`}>
                            <div className="user-card">
                              <UserAvatar
                                theme={item.avatarBg}
                                className="xs"
                                text={findUpper(item.firstName + item.lastName)}
                                image={''}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">{item.firstName + ' ' + item.lastName} </span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.dob !== null ? item.dob : '.....'}</span>
                        </DataTableRow>
                        <DataTableRow size="sm">
                          <span>{item.email}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.mobileNumber !== null ? item.mobileNumber : '.....'}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <span>{item.panCard !== null ? item.panCard : '.....'}</span>
                        </DataTableRow>
                        <DataTableRow size="lg">
                          <ul className="list-status">
                            <li>
                              <Icon
                                className={`text-${
                                  item.isConfirmed === true
                                    ? "success"
                                    : item.isConfirmed === false
                                    ? "info"
                                    : "secondary"
                                }`}
                                name={`${
                                  item.isConfirmed === true
                                    ? "check-circle"
                                    : item.isConfirmed === false
                                    ? "alert-circle"
                                    : "alarm-alt"
                                }`}
                              ></Icon>{" "}
                              <span>Email</span>
                            </li>
                          </ul>
                        </DataTableRow>
                        {/* <DataTableRow size="lg">
                          <span>{item.lastLogin}</span>
                        </DataTableRow> */}
                        <DataTableRow>
                          <span
                            className={`tb-status text-${
                              item.status === true ? "success" : item.status ===  false ? "warning" : "danger"
                            }`}
                          >
                            { item.status === true ? "Active" : 'Active' ? "Inactive" : "Inactive"}
                          </span>
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools">
                          <ul className="nk-tb-actions gx-1">
                            <li className="nk-tb-action-hidden" onClick={() => onEditClick(item._id)}>
                              <TooltipComponent
                                tag="a"
                                containerClassName="btn btn-trigger btn-icon"
                                id={"edit" + item.id}
                                icon="edit-alt-fill"
                                direction="top"
                                text="Edit"
                              />
                            </li>
                            {item.status !== "Suspend" && (
                              <React.Fragment>
                                <li className="nk-tb-action-hidden" onClick={() => suspendUser(item.id)}>
                                  <TooltipComponent
                                    tag="a"
                                    containerClassName="btn btn-trigger btn-icon"
                                    id={"suspend" + item.id}
                                    icon="user-cross-fill"
                                    direction="top"
                                    text="Suspend"
                                  />
                                </li>
                              </React.Fragment>
                            )}
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li onClick={() => onEditClick(item.id)}>
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                      </DropdownItem>
                                    </li>
                                    {item.status !== "Suspend" && (
                                      <React.Fragment>
                                        <li className="divider"></li>
                                        <li onClick={() => suspendUser(item.id)}>
                                          <DropdownItem
                                            tag="a"
                                            href="#suspend"
                                            onClick={(ev) => {
                                              ev.preventDefault();
                                            }}
                                          >
                                            <Icon name="na"></Icon>
                                            <span>Suspend User</span>
                                          </DropdownItem>
                                        </li>
                                      </React.Fragment>
                                    )}
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {currentItems.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={data.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No data found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>
        <Modal isOpen={modal.add} toggle={() => setModal({ add: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Add User</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="first_name"
                        defaultValue={formData.first_name}
                        placeholder="Enter first name"
                        ref={register({ required: "First name is required" })}
                      />
                      {errors.first_name && <span className="invalid">{errors.first_name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="last_name"
                        defaultValue={formData.last_name}
                        placeholder="Enter last name"
                        ref={register({ required: "Last name is required" })}
                      />
                      {errors.last_name && <span className="invalid">{errors.last_name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="email"
                        defaultValue={formData.email}
                        placeholder="Enter email"
                        ref={register({
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.email && <span className="invalid">{errors.email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name="password"
                        defaultValue={formData.password}
                        placeholder="Enter password"
                        ref={register({ required: "Password is required" })}
                      />
                      {errors.password && <span className="invalid">{errors.password.message}</span>}
                    </FormGroup>
                  </Col>
                  
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="phone"
                        defaultValue={formData.phone}
                        placeholder="Mobile Number"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.phone && <span className="invalid">{errors.phone.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Date of Birth</label>
                      <DatePicker
                        selected={formData.dob}
                        onChange={(date) => setFormData({ ...formData, dob: date })}
                        className="form-control date-picker"
                      />
                      {/* <input
                        className="form-control"
                        type="text"
                        name="dob"
                        defaultValue={formData.dob}
                        placeholder="DOB"
                        // ref={register({ required: "This field is required" })}
                      /> */}
                      {errors.dob && <span className="invalid">{errors.dob.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Pan Card</label>
                      <input
                        className="form-control"
                        type="text"
                        name="pan_card"
                        defaultValue={formData.pan_card}
                        placeholder="Pan Card"
                        // ref={register({ required: "This field is required" })}
                      />
                      {errors.balance && <span className="invalid">{errors.pan_card.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Is Confirmed</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{ value: "Confirmed", label: "Confirmed" }}
                          onChange={(e) => setFormData({ ...formData, confirmedStatus: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus2}
                          defaultValue={{ value: "Active", label: "Active" }}
                          onChange={(e) => setFormData({ ...formData, status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Add User
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal isOpen={modal.edit} toggle={() => setModal({ edit: false })} className="modal-dialog-centered" size="lg">
          <ModalBody>
            <a
              href="#cancel"
              onClick={(ev) => {
                ev.preventDefault();
                onFormCancel();
              }}
              className="close"
            >
              <Icon name="cross-sm"></Icon>
            </a>
            <div className="p-2">
              <h5 className="title">Update User</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                <Col md="6">
                    <FormGroup>
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_first_name"
                        defaultValue={formData.edit_first_name}
                        placeholder="Enter first name"
                        ref={register({ required: "First name is required" })}
                      />
                      {errors.edit_first_name && <span className="invalid">{errors.edit_first_name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_last_name"
                        defaultValue={formData.edit_last_name}
                        placeholder="Enter last name"
                        ref={register({ required: "Last name is required" })}
                      />
                      {errors.edit_last_name && <span className="invalid">{errors.edit_last_name.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Email </label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_email"
                        defaultValue={formData.edit_email}
                        placeholder="Enter email"
                        ref={register({
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "invalid email address",
                          },
                        })}
                      />
                      {errors.edit_email && <span className="invalid">{errors.edit_email.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Password</label>
                      <input
                        className="form-control"
                        type="password"
                        name="edit_password"
                        defaultValue={formData.edit_password}
                        placeholder="Enter password"
                        ref={register({ required: "Password is required" })}
                      />
                      {errors.edit_password && <span className="invalid">{errors.edit_password.message}</span>}
                    </FormGroup>
                  </Col>
                  
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        type="number"
                        name="edit_phone"
                        defaultValue={formData.edit_phone}
                        placeholder="Mobile Number"
                        ref={register({
                          required: "This field is required",
                        })}
                      />
                      {errors.edit_phone && <span className="invalid">{errors.edit_phone.message}</span>}
                    </FormGroup>
                  </Col>

                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Date of Birth</label>
                      <DatePicker
                        selected={formData.edit_dob}
                        onChange={(date) => setFormData({ ...formData, edit_dob: date })}
                        className="form-control date-picker"
                      />
                      {/* <input
                        className="form-control"
                        type="text"
                        name="dob"
                        defaultValue={formData.dob}
                        placeholder="DOB"
                        // ref={register({ required: "This field is required" })}
                      /> */}
                      {errors.edit_dob && <span className="invalid">{errors.edit_dob.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Pan Card</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_pan_card"
                        defaultValue={formData.edit_pan_card}
                        placeholder="Pan Card"
                        // ref={register({ required: "This field is required" })}
                      />
                      {errors.edit_pan_card && <span className="invalid">{errors.edit_pan_card.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Is Confirmed</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus}
                          defaultValue={{ value: "Confirmed", label: "Confirmed" }}
                          onChange={(e) => setFormData({ ...formData, edit_confirmedStatus: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Status</label>
                      <div className="form-control-wrap">
                        <RSelect
                          options={filterStatus2}
                          defaultValue={{ value: "Active", label: "Active" }}
                          onChange={(e) => setFormData({ ...formData, edit_status: e.value })}
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Update User
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#cancel"
                          onClick={(ev) => {
                            ev.preventDefault();
                            onFormCancel();
                          }}
                          className="link link-light"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </Content>
      <ToastContainer />
    </React.Fragment>
  );
};
export default UserList;
