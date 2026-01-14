from rest_framework import serializers
from api.models.cms import HeroSlide, CompanyInfo, AboutFeature, SellingPoint
from api.models.content import InfoPage

class HeroSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroSlide
        fields = '__all__'

class CompanyInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyInfo
        fields = '__all__'

class AboutFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutFeature
        fields = '__all__'

class SellingPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellingPoint
        fields = '__all__'

class InfoPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfoPage
        fields = '__all__'
