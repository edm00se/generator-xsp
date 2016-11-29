<% if (namespace || package) { %>
package <% if (namespace) { %><%= namespace %><% } %><% if (package) { %><%= package %><% } %>;<% } %>

import java.io.Serializable;

import javax.faces.context.FacesContext;<% if (extlib) { %>

import com.ibm.xsp.extlib.util.ExtLibUtil;<% } %>

/**
 * <%= name %> class, configured as a managed bean in <%= scope %>.
 */
public class <%= name %> implements Serializable {

  private static final long serialVersionUID = 1L;
  private static final String myBeanName = "<%= lowerCaseName %>Bean";

  public <%= name %>(){
    // constructor intentionally left blank
  }

  public static <%= name %> getCurrentInstance(){
    <% if (extlib) { %>
    return (<%= name %>) ExtLibUtil.resolveVariable(FacesContext.getCurrentInstance(), <%= name %>.myBeanName);
    <% } -%><% if (!extlib) { %>
    return (<%= name %>) FacesContext.getCurrentInstance().getApplication().getVariableResolver().resolveVariable(FacesContext.getCurrentInstance(), <%= name %>.myBeanName);
    <% } -%>
  }

}
