import React, { useState, useEffect, useContext, useRef } from "react";
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
// import { bulkActionOptions } from "../../utils/Utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../utils/Constant";
import DatePicker from "react-datepicker";
import axios from "axios";

const Banner = () => {
  const { contextData } = useContext(UserContext);
  const [data, setData] =  useState([]);
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
      loanType : "",
      image : "",
      edit_loanType : "",
      edit_image : ""
  });
  const [actionText, setActionText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [sort, setSortState] = useState("");
  const accessToken = localStorage.getItem('accessToken');
  const [loading, setLoading] = useState(false);
  const [loanTypes, setLoanTypes] = useState([])
  const bulkActionOptions = [
    { value: "delete", label: "Delete Banner" },
  ];


  // Sorting data
  const sortFunc = (params) => {
    let defaultData = data;
    if (params === "asc") {
      let sortedData = defaultData.sort((a, b) => a.loanType.name.localeCompare(b.name));
      setData([...sortedData]);
    } else if (params === "dsc") {
      let sortedData = defaultData.sort((a, b) => b.loanType.name.localeCompare(a.name));
      setData([...sortedData]);
    }
  };

  // unselects the data on mount
  useEffect(() => {
    loadBannerData();
    loadLoanType();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadBannerData = async() => {
    setLoading(true);
    const res = await fetch(BASE_URL + 'loan-banner',{
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

  const loadLoanType = async() => {
    setLoading(true);
    const res = await fetch(BASE_URL + 'loan-type',{
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
    var arr = [];
    for(var i = 0; i < response.data.length; i++)
    {
       arr.push({label : response.data[i].name , value : response.data[i]._id})
    }
    setLoanTypes(arr);
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
    result = data.filter((item) => {
         return item.loanType.name.search(value) != -1;
    })
    setData([...result])
  }

  // function to reset the form
  const resetForm = () => {
    setFormData({
      loanType : "",
      edit_loanType : "",
      image : "",
      edit_image : ""
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async(submitData) => {
    const {loanType} = formData;
    var data = new FormData();
    data.append('loanType', loanType);
    data.append('image',submitImage);

    try{
    const res = await fetch(BASE_URL + `loan-banner`,{
        method : "post",
        headers : {
            // "Content-Type" : "application/json",
            'Authorization': 'Bearer ' + accessToken,
        },
        body : data
     });
     const response = await res.json();
     if(response.status)
     {
      toast.success(response.message,{
        position: toast.POSITION.RIGHT_TOP,
        autoClose:3000
      });
      setModal({ add: false });
      loadBannerData();
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
    const {edit_loanType} = formData;
    var data = new FormData();
    data.append('loanType', typeof edit_loanType === 'object' ? edit_loanType.value : edit_loanType);
    data.append('image',submitEditImage);

    try{
    const res = await fetch(BASE_URL + `loan-banner/${editId}`,{
        method : "put",
        headers : {
            // "Content-Type" : "application/json",
            'Authorization': 'Bearer ' + accessToken,
        },
        body : data
     });
     const response = await res.json();
     if(response.status)
     {
      toast.success(response.message,{
        position: toast.POSITION.RIGHT_TOP,
        autoClose:3000
      });
      setModal({ add: false });
      loadBannerData();
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

    // const {edit_loanType,edit_image} = formData;
    // let submittedData = {
    //   loanType : edit_loanType,
    //   image : edit_image
    // };

    // try{
    // const res = await fetch(BASE_URL + `loan-banner/${editId}`,{
    //     method : "put",
    //     headers : {
    //         "Content-Type" : "application/json",
    //         'Authorization': 'Bearer ' + accessToken,
    //     },
    //     body : JSON.stringify(submittedData)
    //  });
    //  const response = await res.json();
    //  if(response.status)
    //  {
    //   toast.success(response.message,{
    //     position: toast.POSITION.RIGHT_TOP,
    //     autoClose:3000
    //   });
    //   setModal({ add: false });
    //   loadBannerData();
    //  }
    //  else{
    //   toast.error(response.message,{
    //     position: toast.POSITION.RIGHT_TOP,
    //     autoClose:3000
    //   });
    //  }
    // }
    // catch(err){
    //     console.log(err)
    // }

    setModal({ edit: false });
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    data.forEach((item) => {
      if (item._id === id) {
        console.log(item.loanType._id)
        let types = loanTypes.filter((data) => data.value === item.loanType._id);

        setFormData({
          edit_loanType: Array.isArray(types) ? types[0] : item.loanType,
          edit_image : "",
        });
        setModal({ edit: true }, { add: false });
        setEditedId(id);
      }
    });
  };


  // function which fires on applying selected action
  const onActionClick = async(e) => {
    if (actionText === "delete") {
      var obj = {};
      var arr = [];
      for(var i = 0 ; i < data.length; i++){
        if(data[i].checked){
          arr.push(data[i]._id);
        }
      }

      obj['loan_banners'] = arr;
      
      try{
        const res = await fetch(BASE_URL + `loan-banner/bulk-delete`,{
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
            loadBannerData();
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

  const [submitImage , setSubmitImage] = useState('');
  const [submitEditImage , setSubmitEditImage] = useState('');

  const uploadHandler = (e) => {
      setSubmitImage(e.target.files[0]);
  }

  const uploadHandlerEdit = (e) => {
    setSubmitEditImage(e.target.files[0]);
  }

  return (
    <React.Fragment>
      <Head title="Loan Banner Lists"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h3" page>
                Loan Banner Lists
              </BlockTitle>
              <BlockDes className="text-soft">
                <p>You have total {data.length} loan banners.</p>
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
                  <span className="sub-text">Loan Type</span>
                </DataTableRow>
                <DataTableRow size="md">
                  <span className="sub-text">Image</span>
                </DataTableRow>
                <DataTableRow size="sm">
                  <span className="sub-text">Created At</span>
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
                          <div>
                            <div className="user-card">
                              <UserAvatar
                                theme={item.avatarBg}
                                className="xs"
                                text={findUpper(item.loanType.name)}
                                image={''}
                              ></UserAvatar>
                              <div className="user-info">
                                <span className="tb-lead">{item.loanType.name} </span>
                              </div>
                            </div>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="md">
                            {console.log(item.imageUrl)}
                          <div style={{}}>
                              <img className="border border-info rounded" src={item.imageUrl}  alt={item.loanType.name} style={{
                                  with : 120,
                                  height : 70,
                              }}/>
                          </div>
                        </DataTableRow>
                        <DataTableRow size="md">
                          <span>{new Date(item.createdAt).toLocaleString()}</span>
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
              <h5 className="title">Add Loan Banner</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onFormSubmit)} >
                  <Col md="6">
                    <FormGroup>
                      
                      <label className="form-label">Loan Type</label>
                      <RSelect options={loanTypes} name="loanType" placeholder="Loan Type" defaultValue={formData.loanType} onChange={(e) => {
                             formData.loanType = e.value;
                             setFormData(formData)
                      }} />
                      {errors.loanType && <span className="invalid">{errors.loanType.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Banner Image</label>
                      <input
                        className="form-control"
                        type="file"
                        name="image"
                        defaultValue={formData.image}
                        placeholder="Select image"
                        onChange={(e) => uploadHandler(e)}
                        id="file"
                        ref={register({ required: "Image is required" })}
                      />
                      {errors.image && <span className="invalid">{errors.image.message}</span>}
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
              <h5 className="title">Update Loan Banner</h5>
              <div className="mt-4">
                <Form className="row gy-4" onSubmit={handleSubmit(onEditSubmit)}>
                <Col md="6">
                    <FormGroup>
                    <label className="form-label">Loan Type</label>
                      <RSelect options={loanTypes} name="edit_loanType" placeholder="Loan Type" defaultValue={formData.edit_loanType} onChange={(e) => {
                             formData.edit_loanType = e.value;
                             setFormData(formData)
                      }} />
                      {errors.edit_loanType && <span className="invalid">{errors.edit_loanType.message}</span>}
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label">Banner Image</label>
                      <input
                        className="form-control"
                        type="file"
                        name="image"
                        defaultValue={formData.edit_image}
                        placeholder="Select image"
                        onChange={(e) => uploadHandlerEdit(e)}
                        id="file"
                        ref={register({ required: "Image is required" })}
                      />
                      {errors.image && <span className="invalid">{errors.image.message}</span>}
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
export default Banner;
