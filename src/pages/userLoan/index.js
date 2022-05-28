import React, { useState, useEffect, useContext } from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head";
import { findUpper } from "../../utils/Utils";
import { filterStatus } from "../pre-built/user-manage/UserData";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../utils/Constant";


const UserLoan = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [sm, updateSm] = useState(false);
  const [tablesm, updateTableSm] = useState(false);
  const [onSearch, setonSearch] = useState(true);
  const [onSearchText, setSearchText] = useState("");
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const bulkActionOptions = [
    { value: "delete", label: "Delete User" },
  ];
  const [editId, setEditedId] = useState();
  const [formData, setFormData] = useState({
      user : "",
      loan : "",
      residentialType : "",
      houseNo : "",
      landmark : "",
      locality : "",
      pincode : "",
      city : "",
      amount : "",
      monthlyIncome : "",
      companyName : "",
      durationMonth : "",
      durationYear : "",
      edit_user : "",
      edit_loan : "",
      edit_residentialType : "",
      edit_houseNo : "",
      edit_landmark : "",
      edit_locality : "",
      edit_pincode : "",
      edit_city : "",
      edit_amount : "",
      edit_monthlyIncome : "",
      edit_companyName : "",
      edit_durationMonth : "",
      edit_durationYear : ""
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false);
  const [filterLoan,   setFilterLoan] = useState([]);
  const [filterResidentialType,setFilterResidentialType] = useState([]);
  const [residentialType, setResidentialType] = useState([])
  const [myLoan, setMyLoan] = useState([]);
  const [users, setUsers] = useState([]);

  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.user.firstName.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.user.lastName.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    loadTypeData();
    loadUser();
    loadLoans();
    loadResidentialType();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTypeData = async() => {
    setLoading(true);
    const res = await fetch(BASE_URL + 'user-loan/all',{
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

    console.log(data)
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
    console.log('Call function -' + value)
    result = data.filter((item) => {
         return item.user.firstName.search(value) != -1;
    })
    console.log('Result')
    console.log(result)
    console.log('Result')
    setData([...result])
  }

  // function to reset the form
  const resetForm = () => {
    setFormData({
        user : "",
        loan : "",
        residentialType : "",
        houseNo : "",
        landmark : "",
        locality : "",
        pincode : "",
        city : "",
        amount : "",
        monthlyIncome : "",
        companyName : "",
        durationMonth : "",
        durationYear : "",
        edit_user : "",
        edit_loan : "",
        edit_residentialType : "",
        edit_houseNo : "",
        edit_landmark : "",
        edit_locality : "",
        edit_pincode : "",
        edit_city : "",
        edit_amount : "",
        edit_monthlyIncome : "",
        edit_companyName : "",
        edit_durationMonth : "",
        edit_durationYear : ""
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const {  houseNo, landmark, locality, pincode, city, amount, monthlyIncome ,companyName} = submitData;
    const {user,loan,residentialType,durationYear,durationMonth} = formData;
    let submittedData = {
        user : user,
        loan : loan,
        residentialType : residentialType,
        houseNo : houseNo,
        landmark : landmark,
        locality : locality,
        pincode : pincode,
        city : city,
        amount : amount,
        monthlyIncome : monthlyIncome,
        companyName : companyName,
        durationMonth : durationMonth,
        durationYear : durationYear
    };

    console.log(submittedData)
    try{
    const res = await fetch(BASE_URL + `user-loan`,{
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
      loadTypeData();
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
  };

  // submit function to update a new item
  const onEditSubmit = async(submitData) => {
    const {  edit_houseNo, edit_locality, edit_pincode, edit_city, edit_amount ,edit_companyName} = submitData;
    const {edit_user,edit_loan,edit_residentialType,edit_durationYear,edit_durationMonth,edit_landmark,edit_monthlyIncome} = formData;
    let submittedData = {
        user : typeof edit_user === 'object' ? edit_user.value : edit_user ,
        loan : typeof edit_loan === 'object' ? edit_loan.value  : edit_loan,
        residentialType : typeof edit_residentialType === 'object' ? edit_residentialType.value  : edit_residentialType,
        houseNo : edit_houseNo,
        landmark : edit_landmark,
        locality : edit_locality,
        pincode : edit_pincode,
        city : edit_city,
        amount : edit_amount,
        monthlyIncome : edit_monthlyIncome,
        companyName : edit_companyName,
        durationMonth : edit_durationMonth,
        durationYear : edit_durationYear,
    };

    console.log(submittedData)

    try{
    const res = await fetch(BASE_URL + `user-loan/${editId}`,{
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
        setModal({ edit: false });
        loadTypeData();
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
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item._id === id) {
        let resident = residentialType.filter((data) => data._id === item.residentialType._id)[0];
        let use = users.filter((data) => data._id === item.user._id)[0];
        let my = myLoan.filter((data) => data._id === item.loan._id)[0];
        console.log('Res -----------------')
        console.log(use)
        console.log('Res -----------------')
        // return;
        setFormData({
        edit_user : { label : use.firstName + ' ' + use.lastName ,value : use._id },
        edit_loan : { label : my.name ,value : my._id },
        edit_residentialType : { label : resident.name ,value : resident._id },
        edit_houseNo : item.loanAddress.houseNo,
        edit_landmark : item.loanAddress.landmark,
        edit_locality : item.loanAddress.locality,
        edit_pincode : item.loanAddress.pincode,
        edit_city : item.loanAddress.city,
        edit_amount : item.amount,
        edit_monthlyIncome : item.monthlyIncome,
        edit_companyName : item.companyName,
        edit_durationMonth : item.durationMonth,
        edit_durationYear : item.durationYear,
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);

        console.log('Edit')
        console.log({
            edit_user : item.user._id,
            edit_loan : item.loan._id,
            edit_residentialType : item.residentialType._id,
            edit_houseNo : item.houseNo,
            edit_landmark : item.landmark,
            edit_locality : item.locality,
            edit_pincode : item.pincode,
            edit_city : item.city,
            edit_amount : item.amount,
            edit_monthlyIncome : item.monthlyIncome,
            edit_companyName : item.companyName,
            edit_durationMonth : item.durationMonth,
            edit_durationYear : item.durationYear,
        })
        console.log('EDIT')
      }
    });
  };

  // function which fires on applying selected action
  const onActionClick = async(e) => {
    if (actionText === "delete") {
      var obj = {};
      var arr = [];
      for(var i = 0 ; i < data.length; i++)
      {
        if(data[i].checked)
        {
            arr.push(data[i]._id)
        }
      }
      obj['loans'] = arr;
      try{
        const res = await fetch(BASE_URL + `user-loan/bulk-delete`,{
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
            loadTypeData();
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
      
    //   setData([...newData]);
    }
  };


  const exportTocsv = () => {
    var csv = '_id,User Name,Loan Type,Address,Loan Amount,Monthly Income, Company Name,Duration,Created At\n';
    data.forEach(function(row){
      let address = 'House No - ' + row.loanAddress.houseNo + ' ' + 'Landmark - ' + row.loanAddress.landmark + ' ' + 'Locality - ' + row.loanAddress.locality + ' ' + 'Pincode - ' + row.loanAddress.pincode + ' ' + 'City - ' + row.loanAddress.city;
      csv += (row._id + ',' + row.user.firstName + ' ' + row.user.lastName + ',' + row.loan.name + ',' + address +  ',' + row.amount + ',' + row.monthlyIncome + ',' + row.companyName + ',' + row.durationYear+'Years ' + row.durationMonth+'Month' + ',' + row.createdAt + '\n')
    })

    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
    hiddenElement.target = '_blank';  
      
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'User Loans.csv';  
    hiddenElement.click();  
  }

  // function which selects all the items
  const selectorCheck = (e) => {
    let newData;
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
  const [filterLoanType, setFilterLoanType] = useState([]);

  const loadUser = async() => {
    try{
      const res = await fetch(BASE_URL + `user`,{
          method : "get",
          headers : {
              "Content-Type" : "application/json",
              'Authorization': 'Bearer ' + accessToken,
          },
       });
       const response = await res.json();

       console.log('User list')
       console.log(response)
       console.log('User List')
       if(response.status)
       {
           setUsers(response.data)
         let res = [];
         for(var i = 0; i < response.data.length ; i++){
             res.push({value : response.data[i]._id, label : response.data[i].firstName + ' ' +response.data[i].lastName})
         }
         setFilterLoanType(res)
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

  const loadLoans = async() => {
    try{
      const res = await fetch(BASE_URL + `loan`,{
          method : "get",
          headers : {
              "Content-Type" : "application/json",
              'Authorization': 'Bearer ' + accessToken,
          },
       });
       const response = await res.json();
       if(response.status)
       {
         setMyLoan(response.data);
         let res = [];
         for(var i = 0; i < response.data.length ; i++){
             res.push({value : response.data[i]._id, label : response.data[i].name})
         }
         setFilterLoan(res)
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

  const loadResidentialType = async() => {
    try{
      const res = await fetch(BASE_URL + `residential-type`,{
          method : "get",
          headers : {
              "Content-Type" : "application/json",
              'Authorization': 'Bearer ' + accessToken,
          },
       });
       const response = await res.json();
       if(response.status)
       {
         setResidentialType(response.data);
         let res = [];
         for(var i = 0; i < response.data.length ; i++){
             res.push({value : response.data[i]._id, label : response.data[i].name})
         }
         setFilterResidentialType(res)
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

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="User Loans"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
               User Loans
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} user loans.</p>
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
                          exportTocsv()
                        
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
                  <span className="sub-text">ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">User</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Loan Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Company</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Monthly Income</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Loan Amount</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Duration</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Address Type</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Address</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Created At</span>
                </DataTableRow>
   
                <DataTableRow className="nk-tb-col-tools text-right">
                <span className="sub-text">Action</span>
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
                                text={findUpper(item?.user?.firstName + ' ' + item?.user?.lastName)}
                                image={''}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">{item?.user?.firstName + ' ' + item?.user?.lastName} </span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.loan.name}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.companyName}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.monthlyIncome}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.amount}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.durationYear + ' Years,' + item.durationMonth + ' Month'}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{item.residentialType.name}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{`House No - ${item.loanAddress.houseNo} Landmark - ${item.loanAddress.landmark} Locality - ${item.loanAddress.locality} Pincode - ${item.loanAddress.pincode} City - ${item.loanAddress.city}`}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{new Date(item.createdAt).toDateString()}</span>
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
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle tag="a" className="dropdown-toggle btn btn-icon btn-trigger">
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu right>
                                  <ul className="link-list-opt no-bdr">
                                    <li onClick={() => onEditClick(item._id)}>
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
              <h5 className="title">Add User Loan</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                   <Col md="6">
                    <FormGroup>
                      <label className="form-label">User</label>
                      <RSelect options={filterLoanType} name="user" placeholder="Select User" defaultValue={''} onChange={(e) => {
                             formData.user = e.value;
                             setFormData(formData)
                      }} />
                      {errors.user && <span className="invalid">{errors.user.message}</span>}
                    </FormGroup>
                    </Col>
                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">Loan Name</label>
                      <RSelect options={filterLoan} name="loan" placeholder="Select Loan" defaultValue={''} onChange={(e) => {
                             formData.loan = e.value;
                             let loan = myLoan.filter((item) => item._id === e.value);
                             formData.durationMonth = loan.length > 0 ? loan[0].monthDuration : '';
                             formData.durationYear = loan.length > 0 ? loan[0].yearDuration : '';
                             console.log(formData)
                             setFormData(formData)
                      }} />
                      {errors.loan && <span className="invalid">{errors.loan.message}</span>}
                    </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        name="amount"
                        defaultValue={formData.amount}
                        placeholder="Enter loan amount"
                        ref={register({ required: "Loan amount is required" })}
                      />
                      {errors.amount && <span className="invalid">{errors.amount.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Company Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="companyName"
                        defaultValue={formData.companyName}
                        placeholder="Enter company name"
                        ref={register({ required: "Company name is required" })}
                      />
                      {errors.companyName && <span className="invalid">{errors.companyName.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Monthly Income</label>
                      <input
                        className="form-control"
                        type="text"
                        name="monthlyIncome"
                        defaultValue={formData.monthlyIncome}
                        placeholder="Enter monthly income"
                        ref={register({ required: "Monthly income is required" })}
                      />
                      {errors.monthlyIncome && <span className="invalid">{errors.monthlyIncome.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">Address Type</label>
                      <RSelect options={filterResidentialType} name="addressType" placeholder="Select Address Type" defaultValue={''} onChange={(e) => {
                             formData.residentialType = e.value;
                             setFormData(formData)
                      }} />
                      {errors.loan && <span className="invalid">{errors.loan.message}</span>}
                    </FormGroup>
                    </Col>
                    
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">House No</label>
                      <input
                        className="form-control"
                        type="text"
                        name="houseNo"
                        defaultValue={formData.houseNo}
                        placeholder="Enter house number"
                        ref={register({ required: "House number is required" })}
                      />
                      {errors.houseNo && <span className="invalid">{errors.houseNo.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Landmark</label>
                      <input
                        className="form-control"
                        type="text"
                        name="landmark"
                        defaultValue={formData.landmark}
                        placeholder="Enter landmark"
                        ref={register({ required: "Landmark is required" })}
                      />
                      {errors.landmark && <span className="invalid">{errors.landmark.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Locality</label>
                      <input
                        className="form-control"
                        type="text"
                        name="locality"
                        defaultValue={formData.locality}
                        placeholder="Enter locality"
                        ref={register({ required: "Locality is required" })}
                      />
                      {errors.locality && <span className="invalid">{errors.locality.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Pincode</label>
                      <input
                        className="form-control"
                        type="text"
                        name="pincode"
                        defaultValue={formData.pincode}
                        placeholder="Enter pincode"
                        ref={register({ required: "Pincode is required" })}
                      />
                      {errors.pincode && <span className="invalid">{errors.pincode.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">City</label>
                      <input
                        className="form-control"
                        type="text"
                        name="city"
                        defaultValue={formData.city}
                        placeholder="Enter city"
                        ref={register({ required: "City is required" })}
                      />
                      {errors.city && <span className="invalid">{errors.city.message}</span>}
                      </FormGroup>
                    </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Submit
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
              <h5 className="title">Update User Notification</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">User</label>
                      {console.log('EDIT USER --' + formData.edit_user)}
                      <RSelect options={filterLoanType} name="edit_user" placeholder="Select User" defaultValue={formData.edit_user} onChange={(e) => {
                             formData.edit_user = e.value;
                             setFormData(formData)
                      }} />
                      {errors.edit_user && <span className="invalid">{errors.edit_user.message}</span>}
                    </FormGroup>
                    </Col>
                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">Loan Name</label>
                      <RSelect options={filterLoan} name="edit_loan" placeholder="Select Loan" defaultValue={formData.edit_loan} onChange={(e) => {
                             formData.edit_loan = e.value;
                             let loan = myLoan.filter((item) => item._id === e.value);
                             formData.edit_durationMonth = loan.length > 0 ? loan[0].monthDuration : '';
                             formData.edit_durationYear = loan.length > 0 ? loan[0].yearDuration : '';
                             setFormData(formData)
                      }} />
                      {errors.edit_loan && <span className="invalid">{errors.edit_loan.message}</span>}
                    </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        name="edit_amount"
                        defaultValue={formData.edit_amount}
                        placeholder="Enter loan amount"
                        ref={register({ required: "Loan amount is required" })}
                      />
                      {errors.edit_amount && <span className="invalid">{errors.edit_amount.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Company Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_companyName"
                        defaultValue={formData.edit_companyName}
                        placeholder="Enter company name"
                        ref={register({ required: "Company name is required" })}
                      />
                      {errors.edit_companyName && <span className="invalid">{errors.edit_companyName.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Monthly Income</label>
                      <input
                        className="form-control"
                        type="text"
                        name="monthlyIncome"
                        defaultValue={formData.edit_monthlyIncome}
                        placeholder="Enter monthly income"
                        ref={register({ required: "Monthly income is required" })}
                      />
                      {errors.edit_monthlyIncome && <span className="invalid">{errors.edit_monthlyIncome.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">Address Type</label>
                      <RSelect options={filterResidentialType} name="addressType" placeholder="Select Address Type" defaultValue={formData.edit_residentialType} onChange={(e) => {
                             formData.edit_residentialType = e.value;
                             setFormData(formData)
                      }} />
                      {errors.edit_addressType && <span className="invalid">{errors.edit_addressType.message}</span>}
                    </FormGroup>
                    </Col>
                    
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">House No</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_houseNo"
                        defaultValue={formData.edit_houseNo}
                        placeholder="Enter house number"
                        ref={register({ required: "House number is required" })}
                      />
                      {errors.edit_houseNo && <span className="invalid">{errors.edit_houseNo.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Landmark</label>
                      <input
                        className="form-control"
                        type="text"
                        name="landmark"
                        defaultValue={formData.edit_landmark}
                        placeholder="Enter landmark"
                        ref={register({ required: "Landmark is required" })}
                      />
                      {errors.edit_landmark && <span className="invalid">{errors.edit_landmark.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Locality</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_locality"
                        defaultValue={formData.edit_locality}
                        placeholder="Enter locality"
                        ref={register({ required: "Locality is required" })}
                      />
                      {errors.edit_locality && <span className="invalid">{errors.edit_locality.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Pincode</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_pincode"
                        defaultValue={formData.edit_pincode}
                        placeholder="Enter pincode"
                        ref={register({ required: "Pincode is required" })}
                      />
                      {errors.edit_pincode && <span className="invalid">{errors.edit_pincode.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">City</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_city"
                        defaultValue={formData.edit_city}
                        placeholder="Enter city"
                        ref={register({ required: "City is required" })}
                      />
                      {errors.edit_city && <span className="invalid">{errors.edit_city.message}</span>}
                      </FormGroup>
                    </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="md" type="submit">
                          Update
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
export default UserLoan;
