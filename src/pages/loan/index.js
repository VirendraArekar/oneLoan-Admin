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


const Loan = () => {
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
      loan_type : "",
      loan_year : "",
      loan_month : "",
      maximum_amount : "",
      minimum_amount : "",
      interest : "",
      edit_loan_type : "",
      edit_loan_year : "",
      edit_loan_month : "",
      edit_maximum_amount : "",
      edit_minimum_amount : "",
      edit_interest : "",
      name : "",
      edit_name : ""
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false);
  const [loanType,setLoanType] = useState([])

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
    loadTypeData();
    loadLoanType();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTypeData = async() => {
    setLoading(true);
    const res = await fetch(BASE_URL + 'loan',{
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
         return item.firstName.search(value) != -1;
    })
    console.log('Result')
    console.log(result)
    console.log('Result')
    setData([...result])
  }

  // function to reset the form
  const resetForm = () => {
    setFormData({
      loan_type : "",
      loan_year : "",
      loan_month : "",
      maximum_amount : "",
      minimum_amount : "",
      interest : "",
      edit_loan_type : "",
      edit_loan_year : "",
      edit_loan_month : "",
      edit_maximum_amount : "",
      edit_minimum_amount : "",
      edit_interest : "",
      name : "",
      edit_name : ""
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async (submitData) => {
    const {  loan_month, loan_year, minimum_amount, maximum_amount, interest, name } = submitData;
    const {loan_type} = formData;
    let submittedData = {
      loanType: loan_type,
      minAmount : minimum_amount,
      maxAmount : maximum_amount,
      monthDuration : loan_month,
      yearDuration : loan_year,
      interest : interest,
      name : name
    };

    console.log(submittedData)


    try{
    const res = await fetch(BASE_URL + `loan`,{
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

    console.log(submittedData)
    console.log(editId)
    // setData([submittedData, ...data]);
    // resetForm();
    // setModal({ edit: false }, { add: false });
  };

  // submit function to update a new item
  const onEditSubmit = async(submitData) => {
    console.log('Submited')
    const {  edit_loan_month, edit_loan_year, edit_minimum_amount, edit_maximum_amount, edit_interest ,edit_name} = submitData;
    const {edit_loan_type} = formData;
    let submittedData = {
      loanType: typeof edit_loan_type === 'object' ? edit_loan_type.value : edit_loan_type,
      minAmount : edit_minimum_amount,
      maxAmount : edit_maximum_amount,
      monthDuration : edit_loan_month,
      yearDuration : edit_loan_year,
      interest : edit_interest,
      name : edit_name
    };

    console.log(submittedData)

    try{
    const res = await fetch(BASE_URL + `loan/${editId}`,{
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
    console.log(submittedData);
    console.log(editId) 
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item._id === id) {
        let myLoans = loanType.filter(my =>  my._id === item.loanType._id);
        setFormData({
          edit_loan_type : myLoans.length > 0 ? {label : myLoans[0].name, value : myLoans[0]._id} : item.loanType,
          edit_loan_month : item.monthDuration,
          edit_loan_year : item.yearDuration,
          edit_minimum_amount : item.minAmount,
          edit_maximum_amount : item.maxAmount,
          edit_interest : item.interest,
          edit_name : item.name
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);

        console.log('EDIT ----')
        console.log(item.name)
        console.log('EDIT ----')
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
        const res = await fetch(BASE_URL + `loan/bulk-delete`,{
            method : "post",
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
      console.log(obj)
    //   setData([...newData]);
    }
  };

  const exportTocsv = () => {
    var csv = '_id,Loan Name,Loan Type,Duration,Amount,Interest,Created At\n';
    data.forEach(function(row){
      csv += (row._id + ',' + row.name + ',' + row.loanType.name + ',' + row.monthDuration + ' Month and' + row.yearDuration + ' Years,' + row.minAmount + ' - ' + row.maxAmount + ',' + row.interest + ',' + row.createdAt + '\n')
    })

    var hiddenElement = document.createElement('a');  
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);  
    hiddenElement.target = '_blank';  
      
    //provide the name for the CSV file to be downloaded  
    hiddenElement.download = 'Loan Lists.csv';  
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

  const loadLoanType = async() => {
    try{
      const res = await fetch(BASE_URL + `loan-type`,{
          method : "get",
          headers : {
              "Content-Type" : "application/json",
              'Authorization': 'Bearer ' + accessToken,
          },
       });
       const response = await res.json();
       if(response.status)
       {
         setLoanType(response.data)
         let res = [];
         for(var i = 0; i < response.data.length ; i++){
             res.push({value : response.data[i]._id, label : response.data[i].name})
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

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <React.Fragment>
      <Head title="Loan Lists"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Loan Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} loans.</p>
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
                          // ev.preventDefault();
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
                  <span className="sub-text">ID</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Loan Name</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Loan Type</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Duration</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Amount</span>
                </DataTableRow>
                <DataTableRow>
                  <span className="sub-text">Interest</span>
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
                        <DataTableRow size="md">
                          <span>{item.name}</span>
                        </DataTableRow>
                        <DataTableRow>
                          <Link to={`${process.env.PUBLIC_URL}/user-details-regular/${item._id}`}>
                            <div className="user-card">
                              <UserAvatar
                                theme={item.avatarBg}
                                className="xs"
                                text={findUpper(item?.loanType?.name)}
                                image={''}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">{item?.loanType?.name} </span>
                              </div>
                            </div>
                          </Link>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{`${item.yearDuration} years and ${item.monthDuration} month`}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{`${item.minAmount} - ${item.maxAmount}`}</span>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{`${item.interest}%`}</span>
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
              <h5 className="title">Add Loan Type</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)}>
                     <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="name"
                        defaultValue={formData.name}
                        placeholder="Enter loan name"
                        ref={register({ required: "Loan name is required" })}
                      />
                      {errors.name && <span className="invalid">{errors.name.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">Loan Type</label>
                      <RSelect options={filterLoanType} name="loan_type" placeholder="Loan Type" defaultValue={formData.loan_type} onChange={(e) => {
                             formData.loan_type = e.value;
                             console.log('Core')
                             console.log(formData)
                             console.log('Core End')
                             setFormData(formData)
                      }} />
                      {errors.loan_type && <span className="invalid">{errors.loan_type.message}</span>}
                    </FormGroup>
                    </Col>
                    
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Years</label>
                      <input
                        className="form-control"
                        type="number"
                        name="loan_year"
                        defaultValue={formData.loan_year}
                        placeholder="Enter loan year"
                        ref={register({ required: "Loan year is required" })}
                      />
                      {errors.loan_year && <span className="invalid">{errors.loan_year.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Month</label>
                      <input
                        className="form-control"
                        type="number"
                        name="loan_month"
                        defaultValue={formData.loan_month}
                        placeholder="Enter loan month"
                        ref={register({ required: "Loan month is required" })}
                      />
                      {errors.loan_month && <span className="invalid">{errors.loan_month.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Minimum Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        name="minimum_amount"
                        defaultValue={formData.minimum_amount}
                        placeholder="Enter minimum loan amount"
                        ref={register({ required: "Minimum loan amount is required" })}
                      />
                      {errors.minimum_amount && <span className="invalid">{errors.minimum_amount.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Maximum Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        name="maximum_amount"
                        defaultValue={formData.maximum_amount}
                        placeholder="Enter maximum loan amount"
                        ref={register({ required: "Maximum loan amount is required" })}
                      />
                      {errors.maximum_amount && <span className="invalid">{errors.maximum_amount.message}</span>}

                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Interest</label>
                      <input
                        className="form-control"
                        type="number"
                        name="interest"
                        defaultValue={formData.interest}
                        placeholder="Enter loan interest"
                        ref={register({ required: "Loan interest is required" })}
                      />
                      {errors.interest && <span className="invalid">{errors.interest.message}</span>}
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
              <h5 className="title">Update Loan</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>

                     <Col md="6">
                       {console.log('Name ----'+ formData.edit_name)}
                      <FormGroup>
                      <label className="form-label">Loan Name</label>
                      <input
                        className="form-control"
                        type="text"
                        name="edit_name"
                        defaultValue={formData.edit_name}
                        placeholder="Enter loan name"
                        ref={register({ required: "Loan name is required" })}
                      />
                      {errors.edit_name && <span className="invalid">{errors.edit_name.message}</span>}
                      </FormGroup>
                    </Col>

                    <Col md="6">
                    <FormGroup>
                      <label className="form-label">Loan Type</label>
                      <RSelect options={filterLoanType} name="edit_loan_type" placeholder="Loan Type" defaultValue={formData.edit_loan_type} onChange={(e) => {
                             formData.edit_loan_type = e.value;
                             setFormData(formData)
                      }} />
                      {errors.edit_loan_type && <span className="invalid">{errors.edit_loan_type.message}</span>}
                    </FormGroup>
                    </Col>
                    
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Years</label>
                      <input
                        className="form-control"
                        type="number"
                        name="edit_loan_year"
                        defaultValue={formData.edit_loan_year}
                        placeholder="Enter loan year"
                        ref={register({ required: "Loan year is required" })}
                      />
                      {errors.edit_loan_year && <span className="invalid">{errors.edit_loan_year.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Loan Month</label>
                      <input
                        className="form-control"
                        type="number"
                        name="edit_loan_month"
                        defaultValue={formData.edit_loan_month}
                        placeholder="Enter loan month"
                        ref={register({ required: "Loan month is required" })}
                      />
                      {errors.edit_loan_month && <span className="invalid">{errors.edit_loan_month.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Minimum Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        id="number"
                        name="edit_minimum_amount"
                        step="1" min="1000" max="100000000000000000"
                        defaultValue={formData.edit_minimum_amount}
                        placeholder="Enter minimum loan amount"
                        ref={register({ required: "Minimum loan amount is required" })}
                      />
                      {errors.edit_minimum_amount && <span className="invalid">{errors.edit_minimum_amount.message}</span>}
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Maximum Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        id="number"
                        name="edit_maximum_amount"
                        step="1" min="1000" max="100000000000000000"
                        defaultValue={formData.edit_maximum_amount}
                        placeholder="Enter maximum loan amount"
                        ref={register({ required: "Maximum loan amount is required" })}
                      />
                      {errors.edit_maximum_amount && <span className="invalid">{errors.edit_maximum_amount.message}</span>}

                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                      <label className="form-label">Interest</label>
                      <input
                        className="form-control"
                        type="number"
                        name="edit_interest"
                        defaultValue={formData.edit_interest}
                        placeholder="Enter loan interest"
                        ref={register({ required: "Loan interest is required" })}
                      />
                      {errors.edit_interest && <span className="invalid">{errors.edit_interest.message}</span>}
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
export default Loan;
