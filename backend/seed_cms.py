import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SajCarpet.settings')
django.setup()

from api.models.content import InfoPage

def seed_legal_pages():
    pages = [
        {
            "title": "Privacy Policy",
            "slug": "privacy-policy",
            "content": """Last updated: January 01, 2026

This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.

We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.

1. Information We Collect
We may collect personal identification information from Users in a variety of ways, including, but not limited to, when Users visit our site, register on the site, place an order, subscribe to the newsletter, respond to a survey, fill out a form, and in connection with other activities, services, features or resources we make available on our Site. Users may be asked for, as appropriate, name, email address, mailing address, phone number, credit card information. Users may, however, visit our Site anonymously. We will collect personal identification information from Users only if they voluntarily submit such information to us. Users can always refuse to supply personally identification information, except that it may prevent them from engaging in certain Site related activities.

2. How We Use Collected Information
Saj Carpets may collect and use Users personal information for the following purposes:
- To run and operate our Site
- To improve customer service
- To personalize user experience
- To process payments
- To send periodic emails

3. Sharing Your Personal Information
We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above."""
        },
        {
            "title": "Terms & Conditions",
            "slug": "terms-and-conditions",
            "content": """Last updated: January 01, 2026

Please read these terms and conditions carefully before using Our Service.

1. Interpretation and Definitions
The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.

2. Acknowledgment
These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.

Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.

3. Links to Other Websites
Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.

The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.

4. Termination
We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately.

5. Contact Us
If you have any questions about these Terms and Conditions, You can contact us:
- By email: woking@sajcarpets.com
- By phone: 07976839153"""
        }
    ]

    for p in pages:
        obj, created = InfoPage.objects.get_or_create(
            slug=p['slug'],
            defaults={'title': p['title'], 'content': p['content']}
        )
        if created:
            print(f"Created page: {p['title']}")
        else:
            print(f"Page already exists: {p['title']}")

if __name__ == "__main__":
    seed_legal_pages()
