import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

class MediaGalleryView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        media_root = settings.MEDIA_ROOT
        media_url = settings.MEDIA_URL
        files = []

        for root, dirs, filenames in os.walk(media_root):
            for filename in filenames:
                # Get the relative path from the media root
                rel_dir = os.path.relpath(root, media_root)
                if rel_dir == ".":
                    rel_path = filename
                else:
                    rel_path = os.path.join(rel_dir, filename).replace("\\", "/")
                
                # Construct the full URL
                full_url = request.build_absolute_uri(media_url + rel_path)
                
                files.append({
                    "name": filename,
                    "path": rel_path,
                    "url": full_url,
                    "folder": rel_dir if rel_dir != "." else "Root"
                })

        return Response(files)
