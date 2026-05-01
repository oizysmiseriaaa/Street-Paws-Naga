import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, readdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File | null;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate image type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate size (5MB max)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const extension = image.name.split('.').pop() || 'jpg';
    const filename = `animal_${timestamp}_${randomNum}.${extension}`;

    // Convert file to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads folder
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);

    // Return the URL path for the image
    const photoUrl = `/uploads/${filename}`;

    return NextResponse.json({ 
      success: true, 
      photo: photoUrl,
      filename: filename
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

// DELETE - Remove image from storage
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename required' }, { status: 400 });
    }

    // Security: only allow filenames we created
    if (!filename.startsWith('animal_') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    await unlink(filepath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// GET - List all uploaded images (for cleanup purposes)
export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const files = await readdir(uploadDir);
    
    const images = files
      .filter(f => f.startsWith('animal_'))
      .map(f => ({
        name: f,
        url: `/uploads/${f}`
      }));

    return NextResponse.json({ images });
  } catch (error) {
    console.error('List error:', error);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}
