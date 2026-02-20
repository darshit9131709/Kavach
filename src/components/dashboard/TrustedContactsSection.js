'use client';

import TrustedContact from './TrustedContact';

const DEFAULT_CONTACTS = [
  {
    name: 'Dad',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBOWfcfFvJb-MbZd0bgTwONUfEONDpmR1WrWgNFvHSO4JDslc7ZfXuHjji3i_KGQcWjrifpiAaRIf0V5BNo-RYlWfmRnGw_oi8xtZSfCihdnm7n9eZgHNa2fsg-PwNQvE0eVYjraCXiaQb06UKJ9J1uiOlMv4ahU4ysy5i_nuEHWfGy-4BswAq9x_sptrNDn3kaYZryZi8HhXjyaMCBGAo4s7LloEt24MjfppzYtAw1fbIA4VDm88sOJX63nOUG9h3hdSMVnsm9WSk',
  },
  {
    name: 'Sara',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMfyGmXW4DL8SpHtg7cGRSHgzlasfSdTN8LQYTWKaPIxuILYoO8bAZrhawxpv4vRzJ1Be4W6iVu1hPuEws_Z_vPBCw63vKbhxid1O1NEBJNhEGsH4uXtZs53AhnD3CVbsGoUlQxuQ4rdA9Mhs5pFZBLz6dE3vZwlzzcxElgXgKvGTDONhqjSDsJoFOGO7uzPvDHqHwG0XT063qSIvjWemINkYCibk20Kdq2PrZaHuV-dZgCzmY0bcOkd7EThJV7wDho4pFseRtQk',
  },
  {
    name: 'Aman',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB7ByCjO_kwnDB_wIaXXn3-AI7FO-Uj32kRrGFM-SKGBVh-0kXD83rmsiDWmtV0iVw4cSQZjUppLE51az070G5j_5A2SrAi1RkbgY7eFjdvfR7C74swu3AM2riDAYgXAA9agSHuqdRQZojGEWgtOoTjYijufaW2n3OQqpogyK-La39KP80sV1-OVU0LevECR_SjHi8BBgC_AaEe1PGEax8H8LRDDFPY96j247VhAVGhXz3VECEGXs8WmxFVNDbAo3NWbTrSJGRG6aA',
  },
];

/**
 * TrustedContactsSection
 * Full section wrapper (heading + horizontal scroll list of contacts).
 */
export default function TrustedContactsSection({
  title = 'Trusted Contacts',
  contacts = DEFAULT_CONTACTS,
  onContactClick,
  onAddContact,
}) {
  const handleContactClick = (contact, index) => {
    if (onContactClick) {
      onContactClick(contact, index);
    } else {
      console.log('Contact clicked:', contact.name);
    }
  };

  const handleAddContact = () => {
    if (onAddContact) {
      onAddContact();
    } else {
      console.log('Add contact clicked');
    }
  };

  return (
    <section className="mt-8">
      <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
        <TrustedContact isAddButton onClick={handleAddContact} />
        {contacts.map((contact, index) => (
          <TrustedContact
            key={contact.name ?? index}
            name={contact.name}
            imageUrl={contact.imageUrl}
            onClick={() => handleContactClick(contact, index)}
          />
        ))}
      </div>
    </section>
  );
}

