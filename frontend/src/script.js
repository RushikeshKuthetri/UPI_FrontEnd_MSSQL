const fs = require('fs');
const path = require('path');

const updates = [
  { file: 'GradeChange/GradeChange.jsx', search: '<Title label="Grade Change" />', replace: '<Title label="Grade Change" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  { file: 'UpdateBOM/UpdateBOM.jsx', search: '<Title label="Update PO BOM" />', replace: '<Title label="Update PO BOM" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  { file: 'Stoppages/Stoppages.jsx', search: '<Title label="Stoppage Entry" />', replace: '<Title label="Stoppage Entry" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  { file: 'StoppageAlert/StoppageAlert.jsx', search: '<Title label="Stoppage Alert" />', replace: '<Title label="Stoppage Alert" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  { file: 'ProcessOrder/ProcessOrder.jsx', search: '<Title label="Process Order Confirm" />', replace: '<Title label="Process Order Confirm" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  { file: 'MeterReading/MeterReading.jsx', search: '<Title label="Meter Reading" />', replace: '<Title label="Meter Reading" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  { file: 'ManualUpload/ManualUpload.jsx', search: '<Title label="Enable Manual Upload" className="mb-6" />', replace: '<Title label="Enable Manual Upload" className="mb-6" moduleName="Transaction" icon={FaExchangeAlt} />', importStmt: "import { FaExchangeAlt } from 'react-icons/fa';" },
  
  { file: 'RoleMenuMapping/RoleMenuMapping.jsx', search: '<Title label="Role Menu Mapping" />', replace: '<Title label="Role Menu Mapping" moduleName="Manage Admin" icon={IoSettingsOutline} />', importStmt: "import { IoSettingsOutline } from 'react-icons/io5';" },
  { file: 'Roles/Roles.jsx', search: '<Title label="Manage Roles" />', replace: '<Title label="Manage Roles" moduleName="Manage Admin" icon={IoSettingsOutline} />', importStmt: "import { IoSettingsOutline } from 'react-icons/io5';" },
  { file: 'PlantDetails/PlantDetails.jsx', search: '<Title label="Plant Details" />', replace: '<Title label="Plant Details" moduleName="Manage Admin" icon={IoSettingsOutline} />', importStmt: "import { IoSettingsOutline } from 'react-icons/io5';" },
  { file: 'BusinessUnit/BusinessUnit.jsx', search: '<Title label="Business Unit" />', replace: '<Title label="Business Unit" moduleName="Manage Admin" icon={IoSettingsOutline} />', importStmt: "import { IoSettingsOutline } from 'react-icons/io5';" },
];

const dir = 'c:/Users/ghanshyam.patil/Documents/UPI_github/UPI_FrontEnd_MSSQL/frontend/src/pages/';

updates.forEach(u => {
  const p = path.join(dir, u.file);
  let content = fs.readFileSync(p, 'utf8');
  
  if (content.includes(u.search)) {
    content = content.replace(u.search, u.replace);
    if (!content.includes(u.importStmt)) {
      content = content.replace(/(import .*?;\n)/, '\' + u.importStmt + '\n');
      if (!content.includes(u.importStmt)) {
        content = u.importStmt + '\n' + content;
      }
    }
    fs.writeFileSync(p, content, 'utf8');
    console.log('Updated ' + u.file);
  } else {
    console.log('Search not found in ' + u.file);
  }
});
