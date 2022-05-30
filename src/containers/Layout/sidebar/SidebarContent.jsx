import React from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';
import { USER } from '../../../configs/exports';
// import { USER } from '../../../configs/exports';

const SidebarContent = ({
  onClick, changeToLight, changeToDark, sidebarCollapse,
}) => {
  const hideSidebar = () => {
    onClick();
  };
if(USER.role_id== 3)
{
  
  return (
    <div className="sidebar__content">
  
      <ul className="sidebar__block">
        
        <SidebarLink
          title="Search Customer"
          icon="user"
          route="/find_customer"
          onClick={hideSidebar}

        />
  

        <SidebarLink
          title="Customers"
          icon="user"
          route="/customers"
          onClick={hideSidebar}
        />
        
      </ul>



      <div>
        
      <ul className="sidebar__block">
        
        <SidebarCategory title="Settings" icon="cog" sidebarCollapse={sidebarCollapse}>

          <SidebarLink
            title="Countries"
            route="/countries"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="Roles"
            route="/roles"
            onClick={hideSidebar}
          />
         
          <SidebarLink
            title="Staffs"
            route="/staffs"
            onClick={hideSidebar}
          />

        </SidebarCategory>

      </ul>
     
   
      <ul className="sidebar__block">
        <SidebarCategory title="Report" icon="briefcase" sidebarCollapse={sidebarCollapse}>
          
          <SidebarLink
            title="Daily Report"
            route="/deposits"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="All my Reports"
            route="/withdrawals"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="Customer Feedback"
            route="/suspend_account"
            onClick={hideSidebar}
          />
        </SidebarCategory>
      </ul>
    
      
      <ul className="sidebar__block">
        <SidebarLink title="Log Out" icon="exit" route="/log_in" />
      </ul>
      
    </div>
</div>
  );
}else if (USER.role_id==7){
  return (
    <div className="sidebar__content">
  
      <ul className="sidebar__block">
        
        <SidebarLink
          title="Switch  Service"
         
          route="/find_customer"
          onClick={hideSidebar}

        />
      </ul>
      <ul className="sidebar__block">
        <SidebarCategory title="Report" icon="briefcase" sidebarCollapse={sidebarCollapse}>
          
          <SidebarLink
            title="Daily Report"
            route="/deposits"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="All my Reports"
            route="/withdrawals"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="Customer Feedback"
            route="/suspend_account"
            onClick={hideSidebar}
          />
        </SidebarCategory>
      </ul>
      <ul className="sidebar__block">
        <SidebarLink title="Log Out" icon="exit" route="/log_in" />
      </ul>
      
    </div>

  );

}else if (USER.role_id==4)
{
  return(
    <div className="sidebar__content">
      <ul className="sidebar__block">
      <SidebarLink
        title="Finance"
        icon="briefcase"
        route="/loans"
        onClick={hideSidebar}
      />
      
    </ul>
    <ul className="sidebar__block">
        
        <SidebarCategory title="Settings" icon="cog" sidebarCollapse={sidebarCollapse}>

          <SidebarLink
            title="Departaments"
            route="/departaments"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="Taxes"
            route="/taxes"
            onClick={hideSidebar}
          />

          <SidebarLink
            title="Loans"
            route="/customerLoan"
            onClick={hideSidebar}
          />
          
         
          <SidebarLink
            title="Licence"
            route="/licence"
            onClick={hideSidebar}
          />
          <SidebarLink
            title="Employee"
            route="/employee"
            onClick={hideSidebar}
          />

          <SidebarLink
            title="Reports"
            route="/reports"
            onClick={hideSidebar}
          />

        </SidebarCategory>

      </ul>
</div>

);
}
else if (USER.role_id==5)
{
  return(
    <ul className="sidebar__block">
        <SidebarLink
          title="Finance"
          icon="bubble"
          route="/messages"
          onClick={hideSidebar}
        />
      </ul>
);
}
};

SidebarContent.propTypes = {
  changeToDark: PropTypes.func.isRequired,
  changeToLight: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  sidebarCollapse: PropTypes.bool,
};

SidebarContent.defaultProps = {
  sidebarCollapse: false,
};

export default SidebarContent;
