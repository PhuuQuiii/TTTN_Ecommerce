exports.validateBusinessInfo = (req, res, next) => {
    // Check required fields
    const requiredFields = ['ownerName', 'address', 'city', 'citizenshipNumber', 'businessRegisterNumber'];
    
    for (let field of requiredFields) {
        if (!req.body[field]) {
            return res.status(400).json({
                error: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`
            });
        }
    }

    // If files are required, uncomment this section
    /*
    if (!req.files) {
        return res.status(400).json({
            error: 'All required documents must be uploaded'
        });
    }

    const requiredFiles = ['citizenshipFront', 'citizenshipBack', 'businessLicence'];
    for (let field of requiredFiles) {
        if (!req.files[field]) {
            return res.status(400).json({
                error: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`
            });
        }
    }
    */

    next();
};

exports.validateAdminBankInfo = (req, res, next) => {
    // Check required fields
    const requiredFields = ['accountHolder', 'bankName', 'accountNumber'];
    
    for (let field of requiredFields) {
        if (!req.body[field] || req.body[field].trim() === '') {
            return res.status(400).json({
                error: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1').trim()} is required`
            });
        }
    }

    next();
}; 