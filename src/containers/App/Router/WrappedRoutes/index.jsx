import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../../../Layout/index';
import Default from '../../../Dashboards/Default';
import UserSearch  from '../../../Customers/usersearch';
import UsersStaffs from '../../../Users/UsersStaffs';

import Customers from '../../../Customers/Customer';
import CustomerDetails from '../../../Customers/CustomerDetails';
import ImageView from '../../../../shared/components/catalog/imageView';
import SMSLogs from '../../../SMSLogs/SMSlogs';
import WithdrawRequests from '../../../Reports/WithdrawRequests';
import Loan from '../../../Loans/Loan';
import CuastomerStatement from '../../../Loans/CustomerStatement';
import Countries from '../../../Countries/Countries';
import Roles from '../../../Roles/Roles';
import Departaments from '../../../Departaments/Departaments';
import Taxes from '../../../Taxes/Taxes';
import CustomerLoan from '../../../Loans/CustomerLoan';
import Licence from '../../../Licence/Licence';
import Employee from '../../../Employee/Employee';
import Reports from '../../../Reports/Reports';
import SuspendAccount from '../../../Reports/SuspendAccount';
import DepositArchive from '../../../Reports/Deposits';
import CustomerDeposit from '../../../Customers/CustomerDeposit';


export default () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Route path="/staffs" component={UsersStaffs} />
      <Route path="/find_customer" component={UserSearch} />
      <Route path="/dashboard" component={Default} />
      <Route path="/customers" component={Customers} />
      <Route path="/customer_details" component={CustomerDetails} />
      <Route path="/photo_view" component={ImageView} />
      <Route path="/messages" component={SMSLogs} />
      <Route path="/withdrawals" component={WithdrawRequests} />
      <Route path="/loans" component={Loan} />
      <Route path="/customer_statement" component={CuastomerStatement} />



      <Route path="/countries" component={Countries} />
      <Route path="/roles" component={Roles} />

      <Route path="/departaments" component={Departaments} />
      <Route path="/taxes" component={Taxes} />
      <Route path="/customerLoan" component={CustomerLoan} />
      <Route path="/licence" component={Licence} />
      <Route path="/employee" component={Employee} />
      <Route path="/reports" component={Reports} />
    

      <Route path="/suspend_account" component={SuspendAccount} />
      <Route path="/deposits" component={DepositArchive} />
      <Route path="/customer_deposits" component={CustomerDeposit} />




    </div>
  </div>
);
