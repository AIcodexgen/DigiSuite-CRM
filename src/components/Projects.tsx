import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Filter, 
  MoreHorizontal,
  ExternalLink,
  ArrowLeft,
  X,
  Play,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

export const Projects = () => {
  const navigate = useNavigate();
  const { projects, clients, runProjectAgent } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="shrink-0 h-9 w-9"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground mt-1">Track the progress of active service delivery.</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/30">
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Service</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Progress</TableHead>
              <TableHead className="text-right font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const client = clients.find(c => c.id === project.clientId);
              return (
                <TableRow key={project.id} className="hover:bg-secondary/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {client?.company.charAt(0)}
                      </div>
                      <span className="font-medium">{client?.company}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{project.serviceType}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-[9px] font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                        onClick={() => window.open(client?.website || '#', '_blank')}
                      >
                        <ExternalLink className="w-2.5 h-2.5 opacity-50 group-hover:opacity-100" />
                        View Account
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5 min-w-[200px]">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-500",
                              project.isAgentRunning ? "bg-blue-600 animate-pulse" : "bg-primary"
                            )} 
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium tabular-nums">{Math.floor(project.progress)}%</span>
                      </div>
                      {project.agentStatus && (
                        <p className={cn(
                          "text-[10px] font-medium flex items-center gap-1.5",
                          project.isAgentRunning ? "text-blue-600" : "text-green-600"
                        )}>
                          {project.isAgentRunning && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
                          {project.agentStatus}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(project.serviceType === 'SEO' || project.serviceType === 'SMM') && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-[10px] font-bold uppercase tracking-wider px-3"
                          onClick={() => runProjectAgent(project.id)}
                          disabled={project.isAgentRunning || project.progress === 100}
                        >
                          {project.isAgentRunning ? (
                            <>
                              <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                              Running
                            </>
                          ) : project.progress === 100 ? (
                            <>
                              <RotateCcw className="w-3 h-3 mr-1.5" />
                              Re-Run
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1.5 fill-current" />
                              Run Agent
                            </>
                          )}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
