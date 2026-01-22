import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
}

interface BlogTableProps {
  posts: BlogPost[];
}

export function BlogTable({ posts }: BlogTableProps) {
  return (
    <div className="bg-card rounded-xl border shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.id}</TableCell>
              <TableCell>
                <div className="max-w-md">
                  <div className="font-medium text-card-foreground mb-1">
                    {post.title}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{post.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {post.date}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="group">
                  View
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
