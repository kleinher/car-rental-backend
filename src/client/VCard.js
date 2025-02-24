

const parseVCard = (vcard) => {
    const contact = {
        name: '',
        phone: '',
        address: '',
    };

    const nameMatch = vcard.match(/FN:([^\n]+)/);
    const phoneMatch = vcard.match(/TEL.*?:(\+?\d[\d\s]*)/);
    const addressMatch = vcard.match(/ADR;.*?:(.*?);/);

    if (nameMatch) contact.name = nameMatch[1].trim();
    if (phoneMatch) contact.phone = phoneMatch[1].trim().replace(/[\s+]/g, '');
    if (addressMatch) contact.address = addressMatch[1].trim();

    return contact;
};

module.exports = { parseVCard };

