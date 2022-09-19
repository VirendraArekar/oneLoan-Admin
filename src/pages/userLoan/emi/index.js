import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import {
  Modal,
  ModalBody,
  Form,
} from "reactstrap";
import {
  Icon,
  Row,
  Col
} from "../../../components/Component";
import { useForm } from "react-hook-form";;
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useParams} from "react-router-dom";
import { getAPI } from "../../../nework";
import { useTheme } from "styled-components";
import './style.css'



const UserLoanEmi = () => {
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });


  const [formData, setFormData] = useState({
      
  });

  const {id} = useParams();
  const [loan, setLoan] = useState({});
  const [emis, setEmis] = useState([]);
  const [interest, setInterest] = useState(0)
  const [total, setTotal] = useState(0)


  // unselects the data on mount
  useEffect(() => {
    getLoanInfo()
    getLoanEmi()
    console.log('ID --', id)
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLoanInfo = async() => {
    let data = await getAPI(`/user-loan/${id}`);
    if(data){
        let sort = data.loan.durationWithInterest.filter((item) => item.monthDuration == data.durationMonth && item.yearDuration == data.durationYear)[0].interest;
     
        setInterest(sort);
        setTotal(data.amount + Math.ceil(data.amount * (sort/100)));
        setLoan(data)
    }
  }


  const getLoanEmi = async() => {
    let data = await getAPI(`/loan-emi/${id}`);
    if(data){
        setEmis(data)
    }
  }

  // function to reset the form
  const resetForm = () => {
    setFormData({
       
    });
  };

  // function to close the form modal
  const onFormCancel = () => {
    setModal({ edit: false, add: false });
    resetForm();
  };


  // submit function to update a new item
  const onFormSubmit  = async(submitData) => {
    // const {  edit_houseNo, edit_locality, edit_pincode, edit_city, edit_amount ,edit_companyName} = submitData;
    // const {edit_user,edit_loan,edit_residentialType,edit_durationYear,edit_durationMonth,edit_landmark,edit_monthlyIncome} = formData;
    // let submittedData = {
    //     user : typeof edit_user === 'object' ? edit_user.value : edit_user ,
    //     loan : typeof edit_loan === 'object' ? edit_loan.value  : edit_loan,
    //     residentialType : typeof edit_residentialType === 'object' ? edit_residentialType.value  : edit_residentialType,
    //     houseNo : edit_houseNo,
    //     landmark : edit_landmark,
    //     locality : edit_locality,
    //     pincode : edit_pincode,
    //     city : edit_city,
    //     amount : edit_amount,
    //     monthlyIncome : edit_monthlyIncome,
    //     companyName : edit_companyName,
    //     durationMonth : edit_durationMonth,
    //     durationYear : edit_durationYear,
    // };

    
  };

  const { errors, register, handleSubmit } = useForm();


  return (
    <React.Fragment>
      <Head title="User Loans"></Head>
      <Content>
        <h4>Loan Information</h4>
        <div className="container">
           <div className="row">
              <div className="col-md-4 col-xm-12">
                <div className="box">LOAN ID : {loan?.loanId}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                <div className="box">LOAN TYPE : {loan?.loan?.name}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                <div className="box">LOAN TYPE : AMOUNT : {loan.amount}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                <div className="box">DURATION : {loan?.durationMonth} Months and {loan?.durationYear} Years</div>
              </div>
              <div className="col-md-4 col-xm-12">
                 <div className="box">Interest : {interest}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                 <div className="box">TOTAL AMOUNT : {total}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                 <div className="box">DUE DATE : {loan?.dueDate !== null ? loan?.dueDate : 'NA'}</div>
              </div>
           </div>
        </div>

        <h4 className="mt-4">User Information</h4>
        <div className="container">
           <div className="row">
              <div className="col-md-4 col-xm-12">
                <div className="box">NAME : {loan?.user?.firstName ?? '' + ' ' + loan?.user?.lastName ?? ''}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                <div className="box">MOBILE : {loan?.user?.mobileNumber}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                 <div className="box">EMAIL : {loan?.user?.email ?? 'NA'}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                <div className="box">Company : {loan?.companyName} </div>
              </div>
              <div className="col-md-4 col-xm-12">
                 <div className="box">MONTHLY INCOME : {loan?.monthlyIncome}</div>
              </div>
              
              <div className="col-md-4 col-xm-12">
                 <div className="box">RESIDENTIAL TYPE : {loan?.residentialType?.name}</div>
              </div>
              <div className="col-md-4 col-xm-12">
                <div className="box">Address : {`House No - ${loan?.loanAddress?.houseNo}, Landmark - ${loan?.loanAddress?.landmark}, Locality - ${loan?.loanAddress?.locality}, City - ${loan?.loanAddress?.city}, Pincode - ${loan?.loanAddress?.pincode}`}</div>
              </div>
              
           </div>
        </div>

        <h3 className="text-center mt-2">EMI LIST</h3>
        <div className="container">
           <div className="row">
              {
                emis.map((item,index) => (
                    <div className="col-md-4 col-xm-12" key={index}>
                        <div className="box-alt">
                            DUE DATE : {item.dueDate} <br></br>
                            AMOUNT : {item.amount} <br></br>
                            PAID DATE : {item.paidDate ?? 'NA'} <br></br>
                            PAYMENT : {item.payment ?? 'NA'} <br></br>
                            PAID BY : {item.paidBy !== null ? item?.paidBy?.firstName : 'NA'} <br></br>
                            STATUS : <span className="badge p-1 text-light" style={{backgroundColor : item?.status?.color}}>{item?.status?.name}</span> <br></br>
                        </div>
                    </div>
                ))
              }
           </div>
        </div>
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
export default UserLoanEmi;
